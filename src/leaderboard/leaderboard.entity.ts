import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';

@Entity('leaderboard')
export class Leaderboard {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.leaderboardEntries)
  user!: User;

  @Column({ default: 'all_time' })
  season!: string;

  @Column()
  elo!: number;

  @Column({ nullable: true })
  rank!: number;

  @UpdateDateColumn()
  updated_at!: Date;
}
