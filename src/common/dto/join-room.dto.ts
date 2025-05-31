import { Player } from '../types/player.interface';

export class JoinRoomDto {
  id: string | undefined;
  opponent!: Player;
}
