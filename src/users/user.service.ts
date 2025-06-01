import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findById(id: number) {
    return this.repo.findOneBy({ id });
  }

  create(data: Partial<User>) {
    return this.repo.save(data);
  }

  update(id: number, data: Partial<User>) {
    return this.repo.update(id, data);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }

  async updateAfterMatch(
    userId: number,
    body: { eloChange: number; expGain: number; isWin: boolean },
  ) {
    const user = await this.repo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');

    user.elo += body.eloChange;
    user.exp += body.expGain;
    user.total_matches += 1;
    if (body.isWin) {
      user.wins += 1;
    } else {
      user.losses += 1;
    }

    await this.repo.save(user);
    return user;
  }
}
