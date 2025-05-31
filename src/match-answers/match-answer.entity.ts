import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Match } from 'src/matches/match.entity';
import { User } from 'src/users/user.entity';

@Unique(['match', 'user', 'question_id'])
@Entity('match_answers')
export class MatchAnswer {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Match, match => match.answers, { onDelete: 'CASCADE' })
  match!: Match;

  @ManyToOne(() => User)
  user!: User;

  @Column()
  question_id!: number;

  @Column()
  selected_answer!: string;

  @Column()
  is_correct!: boolean;

  @CreateDateColumn()
  created_at!: Date;
}
