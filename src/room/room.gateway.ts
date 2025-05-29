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
import { CreateRoomDto, JoinRoomDto, Room } from 'src/common/types/room.interface';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server!: Server;
    private clientToUserId: Map<string, { userId: number; roomId: string }> = new Map();
    private rooms: Map<string, Room> = new Map();

    handleConnection(client: Socket) {
        console.log(`🔌 Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`❌ Client disconnected: ${client.id}`);

        const info = this.clientToUserId.get(client.id);
        if (!info) return;

        const { userId, roomId } = info;
        const room = this.rooms.get(roomId);
        if (!room) return;

        let isHost = room.host.id === userId;
        let isOpponent = room.opponent?.id === userId;

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
            (room) => !room.opponent,
        );
        client.emit('room_list', availableRooms);
    }

    @SubscribeMessage('create_room')
    handleCreateRoom(@MessageBody() roomData: CreateRoomDto, @ConnectedSocket() client: Socket) {
        console.log('create_room')
        console.log('user: ' + roomData.id)
        if (!roomData.id || !roomData.host?.id) {
            client.emit('error', { message: 'Thông tin phòng hoặc host không hợp lệ' });
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
    handleJoinRoom(@MessageBody() enterRoom: JoinRoomDto, @ConnectedSocket() client: Socket) {
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

    private broadcastRoomList() {
        const availableRooms = Array.from(this.rooms.values()).filter(
            (room) => !room.opponent,
        );
        this.server.emit('room_list', availableRooms);
    }
}
