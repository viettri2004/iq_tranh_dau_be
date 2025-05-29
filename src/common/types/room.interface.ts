import { Player } from 'src/common/types/player.interface';

export class CreateRoomDto {
    id!: string;
    host!: Player;
}

export class JoinRoomDto {
    id!: string;
    user!: Player;
}

export class LeaveRoomDto {
    id!: string;
    userId!: number;
}

export interface Room {
    id: string;
    host: Player;
    opponent?: Player;
    status?: boolean;
}