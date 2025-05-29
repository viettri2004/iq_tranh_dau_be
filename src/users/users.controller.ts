import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthRequest } from '../common/types/auth-request.interface';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getProfile(@Request() req: AuthRequest) {
        const userId = req.user?.sub;
        if (!userId) throw new Error('Unauthorized');
        return this.usersService.findById(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Put('me')
    async updateProfile(@Request() req: AuthRequest, @Body() body: { name: string; email: string }) {
        const userId = req.user?.sub;
        if (!userId) throw new Error('Unauthorized');
        return this.usersService.updateProfile(userId, body.name, body.email);
    }
}
