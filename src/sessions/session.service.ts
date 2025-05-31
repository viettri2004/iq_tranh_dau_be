// src/modules/session/session.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from 'src/sessions/session.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  findByUser(userId: number) {
    return this.sessionRepository.find({
      where: { user: { id: userId } },
      order: { login_time: 'DESC' },
    });
  }

  create(session: Partial<Session>) {
    return this.sessionRepository.save(session);
  }

  deactivateSession(id: number) {
    return this.sessionRepository.update(id, {
      is_active: false,
      logout_time: new Date(),
    });
  }
}
