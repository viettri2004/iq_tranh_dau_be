// src/sessions/session.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from 'src/sessions/session.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Session])],
  exports: [TypeOrmModule], // ✅ export để dùng ở các module khác
})
export class SessionModule {}
