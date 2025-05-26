import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
export declare class UsersService {
    private readonly userRepo;
    constructor(userRepo: Repository<UserEntity>);
    findOrCreateByGoogle(payload: any): Promise<UserEntity>;
    findById(id: number): Promise<UserEntity>;
    updateProfile(id: number, name: string, email: string): Promise<UserEntity>;
}
