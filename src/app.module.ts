// src/app.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { AuthModule } from 'src/auth/auth.module'; // nếu có

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Otp } from './otp/otp.entity';
import { UserModule } from 'src/users/user.module'; // nếu có
import { ConfigModule } from '@nestjs/config';
import { Device } from 'src/devices/device.entity';
import { GameEvent } from 'src/game_events/game-event.entity';
import { Session } from 'src/sessions/session.entity';
import { Room } from 'src/rooms/room.entity';
import { Report } from 'src/reports/report.entity';
import { Question } from 'src/questions/question.entity';
import { Match } from 'src/matches/match.entity';
import { Leaderboard } from 'src/leaderboard/leaderboard.entity';
import { Achievement } from 'src/achievements/achievement.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MatchModule } from 'src/matches/match.module';
import { MatchAnswer } from './match-answers/match-answer.entity';
import { MatchAnswerModule } from 'src/match-answers/match-answer.module';
import { SessionModule } from 'src/sessions/session.module';
import { GeminiModule } from 'src/gemini/gemini.module';
import { CategoryModule } from 'src/categories/category.module';
import { Category } from 'src/categories/category.entity';
import { LeaderboardModule } from './leaderboard/leaderboard.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true, // không cần import lại ở các module khác
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      database: 'quiz_game',
      entities: [
        User,
        Device,
        GameEvent,
        Session,
        Room,
        Report,
        Question,
        Match,
        Leaderboard,
        Achievement,
        MatchAnswer,
        Category,
        Otp,
      ],
      synchronize: true, // 🔥 Tự tạo bảng theo entity (khuyên dùng dev, tắt khi production)
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    AuthModule,
    UserModule,
    MatchModule,
    MatchAnswerModule,
    SessionModule,
    GeminiModule,
    CategoryModule,
    LeaderboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
