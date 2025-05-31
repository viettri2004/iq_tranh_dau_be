import { User } from 'src/users/user.entity';
import {
  calculateElo,
  calculateLevel,
  calculateRankByWins,
  calculateRankPointByWins,
} from 'src/common/helpers/player.helper';
import { Player } from '../types/player.interface';

export function toPlayerResponse(user: User) {
  const response: Player = {
    id: user.id,
    name: user.name,
    level: calculateLevel(user.exp),
    rank: calculateRankByWins(user.wins),
    rankPoint: calculateRankPointByWins(user.wins),
    elo: calculateElo(user.wins, user.losses),
    avatarPath: user.avatar_url ?? '',
    score: 0, // hoặc tính từ user nếu có logic riêng
  };
  return response;
}
