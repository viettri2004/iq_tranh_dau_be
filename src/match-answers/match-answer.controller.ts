import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { MatchAnswerService } from './match-answer.service';
import { MatchAnswer } from 'src/match-answers/match-answer.entity';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateMatchAnswerDto } from 'src/common/dto/create-match-answer.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('match-answers')
@ApiBearerAuth('jwt-auth')
@UseGuards(JwtAuthGuard)
@Controller('match-answers')
export class MatchAnswerController {
  constructor(private readonly matchAnswerService: MatchAnswerService) {}

  @Post()
  @ApiOperation({ summary: '📥 Lưu đáp án của người chơi' })
  @ApiBody({
    type: CreateMatchAnswerDto, // ✅ BẮT BUỘC: để Swagger hiểu đây là DTO class
    description: 'Thông tin đáp án cần lưu',
    examples: {
      example1: {
        summary: 'Ví dụ đáp án đúng',
        value: {
          matchId: 1,
          userId: 1,
          questionId: 5,
          selectedOption: 'C',
          isCorrect: true,
        },
      },
      example2: {
        summary: 'Ví dụ đáp án sai',
        value: {
          matchId: 1,
          userId: 1,
          questionId: 6,
          selectedOption: 'A',
          isCorrect: false,
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Đáp án đã được lưu' })
  create(@Body() body: CreateMatchAnswerDto) {
    return this.matchAnswerService.create(body);
  }

  @Get('match/:matchId')
  @ApiOperation({ summary: '📄 Lấy tất cả đáp án trong một trận đấu' })
  @ApiParam({
    name: 'matchId',
    type: Number,
    example: 1,
    description: 'ID của trận đấu',
  })
  @ApiResponse({ status: 200, description: 'Danh sách đáp án trong trận đấu' })
  findByMatch(@Param('matchId') matchId: number) {
    return this.matchAnswerService.findByMatch(matchId);
  }

  @Get('match/:matchId/user/:userId')
  @ApiOperation({ summary: '📄 Lấy đáp án của người chơi trong một trận' })
  @ApiParam({
    name: 'matchId',
    type: Number,
    example: 1,
    description: 'ID trận đấu',
  })
  @ApiParam({
    name: 'userId',
    type: Number,
    example: 10,
    description: 'ID người chơi',
  })
  @ApiResponse({ status: 200, description: 'Danh sách đáp án của người chơi' })
  findByUserInMatch(
    @Param('matchId') matchId: number,
    @Param('userId') userId: number,
  ) {
    return this.matchAnswerService.findByUserInMatch(matchId, userId);
  }
}
