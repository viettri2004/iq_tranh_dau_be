import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { Session } from 'src/sessions/session.entity';
import { SessionModule } from 'src/sessions/session.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Session]),
    forwardRef(() => AuthModule),
    SessionModule, // ✅ Đưa vào imports, KHÔNG đưa vào providers
  ],

  providers: [UserService], // ✅ SessionModule KHÔNG được đưa vào đây
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
