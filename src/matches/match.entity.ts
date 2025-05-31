import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { MatchAnswer } from 'src/match-answers/match-answer.entity';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  room_id!: string;

  @ManyToOne(() => User, { nullable: false })
  player1!: User;

  @ManyToOne(() => User, { nullable: false })
  player2!: User;

  @Column('json') // lưu mảng câu hỏi hoặc IDs
  questions!: any[];

  @Column({ default: 0 })
  player1_score!: number;

  @Column({ default: 0 })
  player2_score!: number;

  @Column({ default: 0 })
  elo_change!: number;

  @Column({ default: 0 })
  exp_gain!: number;

  @Column({ type: 'varchar', nullable: true }) // win/draw/loss hoặc enum
  result!: string;

  @Column({ type: 'timestamp', nullable: true })
  started_at!: Date;

  @Column({ type: 'timestamp', nullable: true })
  ended_at!: Date;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => MatchAnswer, answer => answer.match, { cascade: true })
  answers!: MatchAnswer[];
}
