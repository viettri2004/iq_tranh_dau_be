import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Question } from 'src/questions/question.entity';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.reports)
  user!: User;

  @ManyToOne(() => Question)
  question!: Question;

  @Column('text')
  reason!: string;

  @Column({ default: 'pending' })
  status!: 'pending' | 'reviewed' | 'rejected';

  @CreateDateColumn()
  created_at!: Date;

  @Column({ type: 'datetime', nullable: true })
  reviewed_at!: Date;

  @Column('text', { nullable: true })
  reviewer_note!: string;
}
