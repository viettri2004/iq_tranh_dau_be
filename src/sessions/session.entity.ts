import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.sessions)
  user!: User;

  @Column('text')
  jwt_token!: string;

  @Column()
  device_info!: string;

  @Column()
  ip_address!: string;

  @CreateDateColumn()
  login_time!: Date;

  @Column({ type: 'datetime', nullable: true })
  logout_time!: Date;

  @Column({ default: true })
  is_active!: boolean;
}
