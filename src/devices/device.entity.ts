import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/users/user.entity';

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  device_type!: string;

  @Column()
  os!: string;

  @Column()
  browser!: string;

  @Column()
  ip_address!: string;

  @Column({ type: 'datetime' })
  last_used!: Date;

  @ManyToOne(() => User, user => user.devices)
  user!: User;
}
