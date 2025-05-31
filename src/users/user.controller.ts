import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserService } from 'src/users/user.service';

import { UserPayload } from 'src/common/interfaces/user-payload.interface';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: UserPayload;
}

@ApiTags('users')
@ApiBearerAuth('jwt-auth')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Lấy thông tin người dùng đang đăng nhập' })
  getProfile(@Req() req: RequestWithUser) {
    return req.user; // payload từ JWT
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.userService.findById(id);
  }
}
