import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';

@Entity('achievements')
export class Achievement {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.achievements)
  user!: User;

  @Column()
  title!: string;

  @Column('text')
  description!: string;

  @Column({ nullable: true })
  icon_url!: string;

  @CreateDateColumn()
  unlocked_at!: Date;
}
