import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';

@Entity('otps')
export class Otp {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  code!: string;

  @Column({ type: 'timestamp' })
  expires_at!: Date;

  @Column({ default: false }) // <-- Thêm dòng này
  used!: boolean;

  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  user!: User;

  @CreateDateColumn()
  created_at!: Date;
}
