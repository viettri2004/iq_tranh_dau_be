// src/gemini/gemini.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { QuizQuestion } from 'src/common/types/quiz-question.interface';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { CategoryService } from 'src/categories/category.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiBearerAuth('jwt-auth')
@UseGuards(JwtAuthGuard)
@Controller('gemini')
export class GeminiController {
  constructor(
    private readonly geminiService: GeminiService,
    private readonly categoryService: CategoryService,
  ) {}

  @Post('getQuestion')
  @ApiOperation({ summary: 'Tạo câu hỏi trắc nghiệm bằng Gemini AI' })
  @ApiBody({
    schema: {
      example: {
        category: 'Tin học',
        total: 10,
      },
    },
  })
  async generatePrompt(
    @Body() body: { category: string; total: number },
  ): Promise<QuizQuestion[]> {
    const category = await this.categoryService.findByName(body.category);
    if (!category) {
      throw new BadRequestException(
        `Danh mục "${body.category}" không tồn tại`,
      );
    }
    return this.geminiService.generateQuizQuestion(body.category, body.total);
  }
}
