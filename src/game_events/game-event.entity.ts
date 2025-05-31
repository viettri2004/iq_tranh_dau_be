import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Match } from 'src/matches/match.entity';

@Entity('game_events')
export class GameEvent {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.gameEvents)
  user!: User;

  @ManyToOne(() => Match)
  match!: Match;

  @Column()
  event_type!: string;

  @Column('json', { nullable: true })
  metadata: any;

  @CreateDateColumn()
  created_at!: Date;
}
