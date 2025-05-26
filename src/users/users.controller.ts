// src/users/users.controller.ts
import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getProfile(@Request() req) {
        return this.usersService.findById(req.user.sub);
    }

    @UseGuards(JwtAuthGuard)
    @Put('me')
    async updateProfile(@Request() req, @Body() body: { name: string; email: string }) {
        return this.usersService.updateProfile(req.user.sub, body.name, body.email);
    }
}
