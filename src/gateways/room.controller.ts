import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { RoomGateway } from 'src/gateways/room.gateway';
import { CreateRoomDto, JoinRoomDto } from 'src/common/types/room.interface';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiExtraModels,
} from '@nestjs/swagger';
import { StartMatchDto } from 'src/common/dto/question.dto';
import { questions } from 'src/common/mockup/questions';

@ApiTags('socket-room (docs)')
@ApiExtraModels(CreateRoomDto, JoinRoomDto)
@Controller('rooms')
export class RoomGateController {
  constructor(private readonly roomGateway: RoomGateway) {}

  @Post('connect')
  @ApiOperation({ summary: '🔌 [Mock] Test handleConnection (JWT auth)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', example: 'your-jwt-token-here' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Xác thực token thành công, mô phỏng socket connected',
  })
  @ApiResponse({ status: 401, description: 'Token không hợp lệ' })
  testSocketConnection(@Body('token') token: string) {
    if (!token) throw new UnauthorizedException('Missing token');

    const mockClient = {
      id: 'mock-client-' + Math.random().toString(36).substring(2),
      handshake: {
        auth: { token },
      },
      disconnect: () => {
        console.log(`Disconnected client`);
      },
    } as any;

    return this.roomGateway.handleConnection(mockClient);
  }

  @Get()
  @ApiOperation({
    summary: '📡 [Socket] Lấy danh sách phòng đang mở (mô phỏng)',
    description: 'Lấy danh sách các phòng đang chờ người chơi.',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách các phòng đang mở',
  })
  getRooms() {
    return Array.from(this.roomGateway['rooms'].values());
  }

  @Post('create')
  @ApiOperation({
    summary: '📡 [Socket] Tạo phòng chơi mới (mô phỏng)',
    description: 'Tạo một phòng chơi mới với thông tin người tạo (host).',
  })
  @ApiBody({
    type: CreateRoomDto,
    description: 'Thông tin tạo phòng: ID và Host',
    examples: {
      example: {
        value: {
          id: 'room_abc123',
          host: { id: 1, name: 'PlayerA' },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Phòng đã được tạo thành công và trả về thông tin phòng',
  })
  createRoom(@Body() body: CreateRoomDto) {
    this.roomGateway.handleCreateRoom(
      body as any,
      {
        id: 'test-client-id',
        join: () => {},
        emit: () => {},
      } as any,
    );
    return {
      id: body.id,
      host: body.host,
      status: true,
      opponent: null,
    };
  }

  @Post('join')
  @ApiOperation({
    summary: '📡 [Socket] Tham gia phòng chơi (mô phỏng)',
    description: 'Người chơi khác tham gia vào một phòng đã được tạo.',
  })
  @ApiBody({
    type: JoinRoomDto,
    description: 'Thông tin phòng và người chơi tham gia',
    examples: {
      example: {
        value: {
          id: 'room_abc123',
          user: { id: 2, name: 'PlayerB' },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description:
      'Tham gia phòng thành công hoặc trả về lỗi nếu phòng không tồn tại hoặc đã đầy',
  })
  joinRoom(@Body() body: JoinRoomDto) {
    this.roomGateway.handleJoinRoom(
      body as any,
      {
        id: 'test-client-id-2',
        join: () => {},
        emit: () => {},
      } as any,
    );

    return Array.from(this.roomGateway['rooms'].values()).filter(
      r => (r.id = body.id),
    );
  }

  @Post(':roomId/leave/:userId')
  @ApiOperation({
    summary: '📡 [Socket] Rời khỏi phòng chơi (mô phỏng)',
    description:
      'Người chơi (host hoặc opponent) thoát khỏi phòng. Nếu host thoát và opponent còn trong phòng, host sẽ được thay thế.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Rời phòng thành công hoặc thông báo lỗi nếu người dùng không thuộc phòng',
  })
  leaveRoom(@Param('roomId') roomId: string, @Param('userId') userId: number) {
    return this.roomGateway.handleLeaveRoom(
      { roomId, userId: Number(userId) },
      {
        id: 'test-client-id',
        leave: () => {},
        emit: () => {},
      } as any,
    );
  }

  @Post(':roomId/start')
  @ApiOperation({
    summary: '📡 [Socket] Bắt đầu trận đấu (mô phỏng)',
    description:
      'Chỉ được gọi khi đã có 2 người chơi trong phòng. Tạo trận đấu mới và bắt đầu.',
  })
  @ApiBody({
    type: StartMatchDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Bắt đầu trận đấu thành công, trả về matchId và thông tin người chơi',
  })
  startMatch(@Param('roomId') roomId: string) {
    return this.roomGateway.handleStartMatch(
      {
        roomId,
        questions: questions,
      },
      {
        id: 'test-client-id',
        emit: () => {},
        join: () => {},
        leave: () => {},
      } as any,
    );
  }
}
