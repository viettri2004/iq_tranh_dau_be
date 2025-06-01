import { Module } from '@nestjs/common';
import { GeminiService } from 'src/gemini/gemini.service';
import { GeminiController } from 'src/gemini/gemini.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/category.entity';
import { CategoryService } from 'src/categories/category.service';
import { AuthModule } from 'src/auth/auth.module';
import { SessionModule } from 'src/sessions/session.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), AuthModule, SessionModule],
  providers: [GeminiService, CategoryService],
  controllers: [GeminiController],
})
export class GeminiModule {}
