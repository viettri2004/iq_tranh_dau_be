import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Match } from 'src/matches/match.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user: User) => user.hostedRooms)
  host_player!: User;

  @ManyToOne(() => User, (user: User) => user.joinedRooms, { nullable: true })
  guest_player!: User;

  @Column({ default: 'waiting' })
  status!: 'waiting' | 'playing' | 'finished';

  @OneToOne(() => Match)
  @JoinColumn()
  match!: Match;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
