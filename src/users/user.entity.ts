// src/entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Device } from 'src/devices/device.entity';
import { Match } from 'src/matches/match.entity';
import { Room } from 'src/rooms/room.entity';
import { Achievement } from 'src/achievements/achievement.entity';
import { Report } from 'src/reports/report.entity';
import { Session } from 'src/sessions/session.entity';
import { GameEvent } from 'src/game_events/game-event.entity';
import { Leaderboard } from 'src/leaderboard/leaderboard.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true, unique: true })
  google_id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  avatar_url!: string;

  @Column({ nullable: true })
  password_hash!: string;

  @Column({ default: 0 })
  elo!: number;

  @Column({ default: 0 })
  exp!: number;

  @Column({ default: 0 })
  total_matches!: number;

  @Column({ default: 0 })
  wins!: number;

  @Column({ default: 0 })
  losses!: number;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => Device, device => device.user)
  devices!: Device[];

  @OneToMany(() => Match, match => match.player1)
  matchesAsPlayer1!: Match[];

  @OneToMany(() => Match, match => match.player2)
  matchesAsPlayer2!: Match[];

  @OneToMany(() => Room, room => room.host_player)
  hostedRooms!: Room[];

  @OneToMany(() => Room, room => room.guest_player)
  joinedRooms!: Room[];

  @OneToMany(() => Achievement, a => a.user)
  achievements!: Achievement[];

  @OneToMany(() => Report, r => r.user)
  reports!: Report[];

  @OneToMany(() => Session, s => s.user)
  sessions!: Session[];

  @OneToMany(() => GameEvent, e => e.user)
  gameEvents!: GameEvent[];

  @OneToMany(() => Leaderboard, l => l.user)
  leaderboardEntries!: Leaderboard[];
}

// Các entity khác nằm trong các file tương ứng (ví dụ: match.entity.ts, room.entity.ts,...)
// Mình có thể tiếp tục tạo thêm các file này nếu bạn cần.
