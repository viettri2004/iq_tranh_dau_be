import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  AuthenticatedSocket,
  CreateRoomDto,
  JoinRoomDto,
  Room,
} from 'src/common/types/room.interface';
import { MatchService } from 'src/matches/match.service';
import { UserService } from 'src/users/user.service';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from 'src/sessions/session.entity';
import { Repository } from 'typeorm/repository/Repository';
import { Match } from 'src/matches/match.entity';
import { Inject } from '@nestjs/common';

interface JwtPayload {
  [key: string]: any;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly matchService: MatchService,
    private readonly userService: UserService,
    @InjectRepository(Session)
    private readonly sessionRepo: Repository<Session>,
    @Inject('MATCH_PROGRESS_MAP')
    private readonly matchProgress: Map<string, { currentQuestion: number }>,
    @Inject('MATCH_TIMERS_MAP')
    private readonly matchTimers: Map<string, NodeJS.Timeout>,
    @Inject('MATCH_ANSWER_TRACKER')
    private readonly matchAnswerTracker: Map<string, Map<number, Set<number>>>,
  ) {}

  @WebSocketServer()
  server!: Server;
  private clientToUserId: Map<string, { userId: number; roomId: string }> =
    new Map();
  private rooms: Map<string, Room> = new Map();

  async handleConnection(client: Socket) {
    const token = client.handshake.auth?.token;

    if (!token) {
      client.disconnect(true);
      return;
    }
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET env variable is not defined');
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    try {
      console.log('JWT_SECRET:', process.env.JWT_SECRET);
      console.log('token:', token);
      console.log(`${process.env.JWT_SECRET}`);
      const session = await this.sessionRepo.findOne({
        where: { jwt_token: token, is_active: true },
        relations: ['user'],
      });

      if (!session) {
        client.emit('unauthorized', 'Session invalid or expired');
        client.disconnect();
        return;
      }

      const authedClient = client as AuthenticatedSocket;
      authedClient.user = session.user;
      authedClient.session = session;
      // const userId = authedClient.user.id;

      // console.log(`✅ Authenticated socket user: ${userId}`);
      // this.clientToUserId.set(client.id, { userId, roomId: '' });
      return { socketClientId: client.id };
    } catch (err) {
      console.log('❌ Invalid token');
      client.disconnect(true);
      return { meseage: 'Invalid token' };
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Client disconnected: ${client.id}`);

    const info = this.clientToUserId.get(client.id);
    if (!info) return;

    const { userId, roomId } = info;
    const room = this.rooms.get(roomId);
    if (!room) return;

    const isHost = room.host.id === userId;
    const isOpponent = room.opponent?.id === userId;

    if (isHost || isOpponent) {
      if (isHost) {
        this.rooms.delete(roomId);
        this.server.to(roomId).emit('room_destroyed', {
          roomId,
        });
        client.emit('room_destroyed', { roomId }); // 👈 gửi thêm về cho chính host
        this.server.socketsLeave(roomId);
      } else if (isOpponent) {
        room.opponent = undefined;
        this.rooms.set(roomId, room);
        const payload = {
          id: room.id,
          host: { ...room.host },
          opponent: null,
        };

        this.server.to(roomId).emit('room_update', payload);
        client.emit('room_update', payload); // 👈 gửi lại cho chính người vừa mất kết nối
      }
    }

    this.clientToUserId.delete(client.id);

    console.log(`🚪 [Auto] User ${userId} left room ${roomId}`);
  }

  @SubscribeMessage('get_rooms')
  handleGetRooms(@ConnectedSocket() client: Socket) {
    const availableRooms = Array.from(this.rooms.values()).filter(
      room => !room.opponent,
    );
    client.emit('room_list', availableRooms);
  }

  @SubscribeMessage('create_room')
  handleCreateRoom(
    @MessageBody() roomData: CreateRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('create_room');
    console.log('user: ' + roomData.id);
    if (!roomData.id || !roomData.host?.id) {
      client.emit('error', {
        message: 'Thông tin phòng hoặc host không hợp lệ',
      });
      return;
    }

    // tạo phòng mới từ dữ liệu sạch
    const newRoom: Room = {
      id: roomData.id,
      host: roomData.host,
      status: true,
      opponent: undefined,
    };

    this.clientToUserId.set(client.id, {
      userId: newRoom.host.id,
      roomId: newRoom.id,
    });

    if (this.rooms.has(newRoom.id)) {
      client.emit('room_created', newRoom);
      return;
    }

    this.rooms.set(newRoom.id, newRoom);
    client.join(newRoom.id);

    client.emit('room_created', newRoom);
    this.emitRoomUpdate(newRoom.id);
    this.broadcastRoomList();
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @MessageBody() enterRoom: JoinRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    const room = this.rooms.get(enterRoom.id);
    this.clientToUserId.set(client.id, {
      userId: enterRoom.user.id, // opponent gửi trong host field
      roomId: enterRoom.id,
    });

    if (!room) {
      client.emit('room_update', { error: 'Phòng không tồn tại!' });
      return;
    }

    if (room.opponent) {
      client.emit('room_update', { error: 'Phòng đã đầy!' });
      return;
    }

    room.opponent = enterRoom.user;
    this.rooms.set(enterRoom.id, room);
    client.join(enterRoom.id);

    this.emitRoomUpdate(enterRoom.id);
    this.broadcastRoomList(); // 👈 thêm dòng này
    if (room.host && room.opponent) {
      this.server.emit('room_update', {
        id: room.id,
        host: { ...room.host },
        opponent: { ...room.opponent! },
      });
    }
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(
    @MessageBody() data: { roomId: string; userId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const currentRoom = this.rooms.get(data.roomId);
    if (!currentRoom) return;

    const isHost = currentRoom.host.id === data.userId;
    const isOpponent = currentRoom.opponent?.id === data.userId;

    if (isHost) {
      if (currentRoom.opponent) {
        const newHost = currentRoom.opponent;
        const updatedRoom: Room = {
          ...currentRoom,
          host: newHost,
          opponent: undefined,
        };
        this.rooms.set(data.roomId, updatedRoom);

        this.server.to(data.roomId).emit('room_update', {
          id: data.roomId,
          host: newHost,
          opponent: null,
        });
      } else {
        // Nếu không có opponent → xoá phòng
        this.rooms.delete(data.roomId);
        this.server.to(data.roomId).emit('room_destroyed', {
          roomId: data.roomId,
        });
        this.server.socketsLeave(data.roomId);
      }
    } else if (isOpponent) {
      // tạo bản sao an toàn
      const updatedRoom = {
        ...currentRoom,
        opponent: undefined,
      };

      this.rooms.set(data.roomId, updatedRoom);
      const payload = {
        id: data.roomId,
        host: { ...updatedRoom.host },
        opponent: null,
      };

      // 👇 Gửi cho tất cả client trong room
      this.server.to(data.roomId).emit('room_update', payload);

      // 👇 Gửi thêm cho client hiện tại (người rời phòng)
      client.emit('room_update', payload);

      client.leave(data.roomId);
    } else {
      client.emit('error', { message: 'Bạn không ở trong phòng này' });
    }

    this.broadcastRoomList();
    console.log(`🚪 User ${data.userId} left room ${data.roomId}`);
  }

  private emitRoomUpdate(roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    this.server.emit('room_update', {
      id: room.id,
      host: room.host,
      opponent: room.opponent || null,
    });
  }

  @SubscribeMessage('start_match')
  async handleStartMatch(
    @MessageBody() data: { roomId: string; questions: any[] },
    @ConnectedSocket() client: Socket,
  ) {
    const room = this.rooms.get(data.roomId);
    console.log(room);
    if (!room || !room.host || !room.opponent) {
      client.emit('error', { message: 'Phòng không hợp lệ để bắt đầu trận!' });
      return { message: 'Phòng không hợp lệ để bắt đầu trận!' };
    }

    const player1 = await this.userService.findById(room.host.id);
    const player2 = await this.userService.findById(room.opponent.id);
    if (!player1 || !player2) {
      client.emit('error', { message: 'Không tìm thấy người chơi!' });
      return { message: 'Không tìm thấy người chơi!' };
    }

    const match = await this.matchService.startMatch(
      player1,
      player2,
      data.questions,
      data.roomId,
    );
    await this.startNextQuestion(match, data.roomId);
    this.server.to(data.roomId).emit('match_started', {
      roomId: data.roomId,
      matchId: match.id,
      players: {
        host: room.host,
        opponent: room.opponent,
      },
      questions: data.questions,
    });

    // ✅ PHẢI RETURN nếu dùng trong HTTP Controller
    return {
      roomId: data.roomId,
      matchId: match.id,
      players: {
        host: room.host,
        opponent: room.opponent,
      },
      questions: data.questions,
    };
  }

  @SubscribeMessage('match_completed')
  handleMatchCompleted(payload: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.server.to(`room_${payload.matchId}`).emit('match_result', payload);
  }

  private broadcastRoomList() {
    const availableRooms = Array.from(this.rooms.values()).filter(
      room => !room.opponent,
    );
    this.server.emit('room_list', availableRooms);
  }

  @SubscribeMessage('selecting_answer')
  handleSelectingAnswer(
    @MessageBody()
    data: {
      roomId: string;
      userId: number;
      questionId: number;
    },
  ) {
    // Gửi cho đối thủ trong cùng phòng
    this.server.to(data.roomId).emit('opponent_selecting', {
      userId: data.userId,
      questionId: data.questionId,
    });
  }
  @SubscribeMessage('answer_question')
  async handleAnswerQuestion(
    @MessageBody()
    data: {
      matchId: number;
      roomId: string;
      userId: number;
      questionId: number;
      selectedOption: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { matchId, roomId, userId, questionId, selectedOption } = data;

    const user = await this.userService.findById(userId);
    const match = await this.matchService.findById(matchId);

    if (!match || !user) {
      this.server
        .to(roomId)
        .emit('error', { message: 'Match or user not found' });
      return;
    }

    // ✅ Kiểm tra đúng/sai
    const isCorrect = this.matchService.checkAnswer(
      match,
      questionId,
      selectedOption,
    );

    // ✅ Lưu đáp án và cập nhật điểm
    await this.matchService.recordAnswer(
      match,
      user,
      questionId,
      selectedOption,
      isCorrect,
    );

    // ✅ Gửi kết quả đúng/sai cho cả phòng
    this.server.to(roomId).emit('answer_result', {
      userId,
      questionId,
      selectedOption,
      isCorrect,
    });

    // ✅ Gửi điểm số cập nhật
    const updatedMatch = await this.matchService.getLiveScores(matchId);

    this.server.to(roomId).emit('score_updated', {
      matchId,
      scores: {
        player1: updatedMatch.player1.score,
        player2: updatedMatch.player2.score,
      },
      answeredBy: userId,
      isCorrect,
    });

    // ✅ Ghi nhận người đã trả lời
    if (!this.matchAnswerTracker.has(roomId)) {
      this.matchAnswerTracker.set(roomId, new Map());
    }
    const questionAnswers = this.matchAnswerTracker.get(roomId)!;
    if (!questionAnswers.has(questionId)) {
      questionAnswers.set(questionId, new Set());
    }
    questionAnswers.get(questionId)!.add(userId);

    const answeredUserIds = questionAnswers.get(questionId)!;
    if (answeredUserIds.size >= 2) {
      // ✅ Hủy timeout vì cả 2 đã trả lời
      const timeout = this.matchTimers.get(roomId);
      if (timeout) clearTimeout(timeout);

      // ✅ Kiểm tra kết thúc trận
      const totalQuestions = match.questions.length;
      const totalAnswers = await this.matchService.countAnswers(matchId);

      if (totalAnswers >= totalQuestions * 2) {
        match.ended_at = new Date();
        match.result = this.matchService.calculateResult(match);
        await this.matchService.saveMatch(match);

        this.server.to(roomId).emit('match_result', {
          matchId: match.id,
          player1_score: match.player1_score,
          player2_score: match.player2_score,
          result: match.result,
        });
        this.server.to(roomId).emit('match_ended', { matchId: match.id });
        return;
      }

      // ✅ Chuyển sang câu tiếp theo
      setTimeout(() => this.startNextQuestion(match, roomId), 1000);
    }
  }

  private async startNextQuestion(match: Match, roomId: string) {
    const progress = this.matchProgress.get(roomId) || { currentQuestion: 0 };
    const questionIndex = progress.currentQuestion;
    const question = match.questions[questionIndex];

    // ❌ Nếu hết câu hỏi → kết thúc
    if (!question) {
      match.ended_at = new Date();
      match.result = this.matchService.calculateResult(match);
      const answeredUsers =
        this.matchAnswerTracker.get(roomId)?.get(question.id) || new Set();
      const usersToCheck = [match.player1.id, match.player2.id];
      for (const uid of usersToCheck) {
        if (!answeredUsers.has(uid)) {
          const user = await this.userService.findById(uid);

          if (!user) {
            this.server
              .to(roomId)
              .emit('error', { message: `User ${uid} not found` });
            continue; // ✅ Bỏ qua user null, không return toàn hàm
          }

          await this.matchService.recordAnswer(
            match,
            user,
            question.id,
            '',
            false,
          );

          this.server.to(roomId).emit('answer_result', {
            userId: uid,
            questionId: question.id,
            selectedOption: null,
            isCorrect: false,
          });
        }
      }

      // 🧼 Clean up state
      this.matchProgress.delete(roomId);
      this.matchTimers.delete(roomId);
      this.matchAnswerTracker.delete(roomId);

      return;
    }

    const totalQuestions = match.questions.length;

    // ✅ Gửi câu hỏi mới kèm thời gian, chỉ số và tổng số câu
    this.server.to(roomId).emit('new_question', {
      questionId: question.id,
      question,
      timeLimit: 10, // giây
      question_index: questionIndex + 1, // bắt đầu từ 1
      question_total: totalQuestions,
    });

    // ✅ Cập nhật tiến trình
    this.matchProgress.set(roomId, {
      currentQuestion: questionIndex + 1,
    });

    // ✅ Reset tracker trả lời của câu này
    if (!this.matchAnswerTracker.has(roomId)) {
      this.matchAnswerTracker.set(roomId, new Map());
    }
    this.matchAnswerTracker.get(roomId)!.set(question.id, new Set());

    // ✅ Hẹn giờ tự động chuyển câu khi hết giờ
    const timeout = setTimeout(async () => {
      this.server.to(roomId).emit('time_up', { questionId: question.id });

      const answeredUsers =
        this.matchAnswerTracker.get(roomId)?.get(question.id) || new Set();

      // ⏰ Xử lý người chưa trả lời (chấm điểm 0)
      const usersToCheck = [match.player1.id, match.player2.id];
      for (const uid of usersToCheck) {
        if (!answeredUsers.has(uid)) {
          const user = await this.userService.findById(uid);
          if (!user) {
            this.server
              .to(roomId)
              .emit('error', { message: `User ${uid} not found` });
            return;
          }

          await this.matchService.recordAnswer(
            match,
            user,
            question.id,
            '',
            false,
          );

          this.server.to(roomId).emit('answer_result', {
            userId: uid,
            questionId: question.id,
            selectedOption: null,
            isCorrect: false,
          });

          this.server.to(roomId).emit('match_ended', { matchId: match.id });
        }
      }

      // Chuyển tiếp sang câu tiếp
      setTimeout(() => this.startNextQuestion(match, roomId), 1000);
    }, 10 * 1000); // 10 giây

    // ✅ Lưu timeout để có thể huỷ nếu cần
    this.matchTimers.set(roomId, timeout);
  }
}
