import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    googleId: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    avatarUrl: string;

    @Column({ default: 1200 })
    elo: number;

    @Column({ default: 0 })
    exp: number;

    @Column({ default: 0 })
    totalMatches: number;

    @Column({ default: 0 })
    wins: number;

    @Column({ default: 0 })
    losses: number;

    @CreateDateColumn()
    createdAt: Date;
}
