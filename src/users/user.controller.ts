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
  @Patch('me/change-password')
  @ApiOperation({ summary: 'Đổi mật khẩu cho người dùng đang đăng nhập' })
  @ApiBody({
    schema: {
      example: {
        currentPassword: 'old_password',
        newPassword: 'new_password123',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Đổi mật khẩu thành công' })
  async changePassword(
    @Req() req: RequestWithUser,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    return this.userService.changePassword(
      req.user.id,
      body.currentPassword,
      body.newPassword,
    );
  }
  @Patch('me/change-name')
  @ApiOperation({ summary: 'Đổi tên người dùng đang đăng nhập' })
  @ApiBody({
    schema: {
      example: {
        newName: 'new name',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Đổi tên thành công' })
  async changeName(
    @Req() req: RequestWithUser,
    @Body() body: { newName: string },
  ) {
    return this.userService.changeName(req.user.id, body.newName);
  }
}
