import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { SessionService } from 'src/sessions/session.service';
import { Session } from 'src/sessions/session.entity';

@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get('user/:userId')
  getUserSessions(@Param('userId') userId: number) {
    return this.sessionService.findByUser(userId);
  }

  @Post()
  create(@Body() session: Partial<Session>) {
    return this.sessionService.create(session);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: number) {
    return this.sessionService.deactivateSession(id);
  }
}
