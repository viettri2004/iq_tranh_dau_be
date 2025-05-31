// match.controller.ts
import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { MatchService } from './match.service';
import { RoomGateway } from 'src/gateways/room.gateway';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('matches') // Nhóm API trong Swagger
@ApiBearerAuth('jwt-auth')
@UseGuards(JwtAuthGuard)
@Controller('matches')
export class MatchController {
  constructor(
    private readonly matchService: MatchService,
    private readonly roomGateway: RoomGateway,
  ) {}

  @Post(':matchId/submit')
  @ApiOperation({ summary: '📨 Nộp đáp án cho một trận đấu cụ thể' })
  @ApiParam({ name: 'matchId', type: Number, description: 'ID của trận đấu' })
  @ApiBody({
    description: 'Thông tin người chơi và danh sách đáp án cần nộp',
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number', example: 1 },
        answers: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              questionId: { type: 'number', example: 101 },
              answer: { type: 'string', example: 'A' },
            },
            required: ['questionId', 'answer'],
          },
        },
      },
      required: ['userId', 'answers'],
    },
    examples: {
      simple: {
        summary: 'Nộp 2 đáp án',
        value: {
          userId: 1,
          answers: [
            { questionId: 101, answer: 'A' },
            { questionId: 102, answer: 'C' },
          ],
        },
      },
      fullMatch: {
        summary: 'Nộp nhiều câu hỏi trong trận đầy đủ',
        value: {
          userId: 2,
          answers: [
            { questionId: 201, answer: 'B' },
            { questionId: 202, answer: 'D' },
            { questionId: 203, answer: 'A' },
            { questionId: 204, answer: 'C' },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description:
      'Đáp án được ghi nhận thành công. Nếu trận kết thúc, kết quả được gửi qua socket.',
  })
  async submitAnswers(
    @Param('matchId') matchId: number,
    @Body() body: { userId: number; answers: any[] },
  ) {
    const match = await this.matchService.submitAnswers(
      matchId,
      body.userId,
      body.answers,
    );

    if ('ended_at' in match) {
      return this.roomGateway.handleMatchCompleted({
        matchId: match.id,
        players: {
          player1: match.player1,
          player2: match.player2,
        },
        player1_score: match.player1_score,
        player2_score: match.player2_score,
        elo_change: match.elo_change,
        exp_gain: match.exp_gain,
        result: match.result,
      });
    }

    return match;
  }
}
