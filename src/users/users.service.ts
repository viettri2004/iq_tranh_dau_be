import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
    ) { }

    // ✅ Đã có
    async findOrCreateByGoogle(payload: any): Promise<UserEntity> {
        let user = await this.userRepo.findOne({ where: { email: payload.email } });
        if (!user) {
            user = this.userRepo.create({
                googleId: payload.sub,
                email: payload.email,
                name: payload.name,
                avatarUrl: payload.picture,
            });
            await this.userRepo.save(user);
        }

        return user;
    }



    // ✅ THÊM HÀM NÀY
    async findById(id: number): Promise<UserEntity> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    // ✅ THÊM HÀM NÀY
    async updateProfile(id: number, name: string, email: string): Promise<UserEntity> {
        await this.userRepo.update(id, { name, email });
        return this.findById(id);
    }
}
