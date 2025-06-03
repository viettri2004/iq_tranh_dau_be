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
}
