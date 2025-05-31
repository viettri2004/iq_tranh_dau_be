import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { Socket } from 'socket.io';
import { Session } from 'src/sessions/session.entity';

export class SocketUserDto {
  @IsInt()
  id!: number;

  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ValidateNested()
  @Type(() => SocketUserDto)
  host!: SocketUserDto;
}

export class JoinRoomDto {
  @IsNotEmpty()
  id!: string;

  @ValidateNested()
  @Type(() => SocketUserDto)
  user!: SocketUserDto;
}

export class LeaveRoomDto {
  @IsNotEmpty()
  id!: string;

  @IsInt()
  userId!: number;
}

export interface Room {
  id: string;
  host: SocketUserDto;
  opponent?: SocketUserDto;
  status?: boolean;
}

export interface AuthenticatedSocket extends Socket {
  user: any; // Bạn có thể định nghĩa kiểu User nếu có
  session: Session;
}
