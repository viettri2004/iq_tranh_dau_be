import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  Patch,
  Body,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
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

  @Patch(':id/update-after-match')
  @ApiOperation({ summary: '🎮 Cập nhật thông tin người dùng sau trận đấu' })
  @ApiBody({
    description: 'Cập nhật elo, exp, kết quả thắng/thua sau một trận đấu',
    schema: {
      example: {
        eloChange: 25,
        expGain: 50,
        isWin: true,
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  async updateUserAfterMatch(
    @Param('id') id: number,
    @Body() body: { eloChange: number; expGain: number; isWin: boolean },
  ) {
    return this.userService.updateAfterMatch(id, body);
  }
}
