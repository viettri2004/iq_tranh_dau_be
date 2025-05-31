import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { QuestionService } from 'src/questions/question.service';
import { Question } from 'src/questions/question.entity';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get()
  getAll() {
    return this.questionService.findAll();
  }

  @Get('random')
  getRandom(@Query('limit') limit = 5, @Query('category') category?: string) {
    return this.questionService.getRandom(+limit, category);
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.questionService.findById(id);
  }

  @Post()
  create(@Body() question: Partial<Question>) {
    return this.questionService.create(question);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() question: Partial<Question>) {
    return this.questionService.update(id, question);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.questionService.remove(id);
  }
}
