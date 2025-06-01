// src/categories/category.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { AuthModule } from 'src/auth/auth.module';
import { SessionModule } from 'src/sessions/session.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), AuthModule, SessionModule],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
