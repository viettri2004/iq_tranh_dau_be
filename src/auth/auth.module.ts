import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from 'src/users/user.entity';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { UserModule } from 'src/users/user.module';
import { Session } from 'src/sessions/session.entity';
import { Otp } from 'src/otp/otp.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Session]),
    TypeOrmModule.forFeature([User, Otp]),
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultsecret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
