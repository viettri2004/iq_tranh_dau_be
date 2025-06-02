import { BadRequestException  } from '@nestjs/common';
import { Controller, Post, Body, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { AuthService } from 'src/auth/auth.service';
import { GoogleLoginDto } from 'src/common//dto/google-login.dto';
import { LoginDto } from 'src/common/dto/login.dto';
import { RegisterDto } from 'src/common/dto/register.dto';
import { UserDto } from 'src/common/dto/user.dto';
import { Session } from 'src/sessions/session.entity';
import { Repository } from 'typeorm';
import { Request } from 'express'; // ✅ Không dùng Fetch API Request!

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Session)
    private readonly sessionRepo: Repository<Session>,
  ) {}

  @Post('google')
  @ApiOperation({ summary: 'Đăng nhập bằng Google ID Token' })
  @ApiResponse({ status: 201, description: 'Đăng nhập thành công, trả về JWT' })
  @ApiResponse({ status: 400, description: 'ID Token không hợp lệ' })
  async loginGoogle(@Req() req: Request, @Body() dto: GoogleLoginDto) {
    const { token, user } = await this.authService.validateGoogle(dto.idToken);
    await this.sessionRepo.save({
      jwt_token: token,
      device_info: req.headers['user-agent'] || 'unknown',
      login_time: new Date(),
      is_active: true,
      user: user,
      ip_address: req.ip || req.connection.remoteAddress || 'unknown',
    });
    return {
      accessToken: token,
      user: plainToInstance(UserDto, user, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @Post('login')
  @ApiOperation({
    summary: 'Đăng nhập bằng email & password (tài khoản nội bộ)',
  })
  @ApiResponse({ status: 201, description: 'Đăng nhập thành công, trả về JWT' })
  @ApiResponse({ status: 401, description: 'Sai email hoặc mật khẩu' })
  async loginLocal(@Req() req: Request, @Body() dto: LoginDto) {
    const { token, user } = await this.authService.loginWithCredentials(
      dto.email,
      dto.password,
    );
    await this.sessionRepo.save({
      jwt_token: token,
      device_info: req.headers['user-agent'] || 'unknown',
      login_time: new Date(),
      is_active: true,
      user: user,
      ip_address: req.ip || req.connection.remoteAddress || 'unknown',
    });
    return {
      accessToken: token,
      user: plainToInstance(UserDto, user, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản nội bộ' })
  @ApiResponse({ status: 201, description: 'Đăng ký thành công, trả về JWT' })
  @ApiResponse({ status: 409, description: 'Email đã được sử dụng' })
  async register(@Body() dto: RegisterDto) {
    const { token, user } = await this.authService.register(
      dto.email,
      dto.name,
      dto.password,
    );

    return {
      accessToken: token,
      user: plainToInstance(UserDto, user, { excludeExtraneousValues: true }),
    };
  }
  @Post('forgot-password')
  @ApiOperation({ summary: 'Gửi OTP để đặt lại mật khẩu qua email' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
      },
      required: ['email'],
    },
  })
  @ApiResponse({ status: 201, description: 'OTP đã được gửi tới email' })
  @ApiResponse({ status: 400, description: 'Email là bắt buộc' })
  async forgotPassword(
    @Body() body: { email?: string }
  ) {
    const { email } = body;
    if (!email) throw new BadRequestException('Email là bắt buộc');

    return this.authService.requestPasswordReset(email);
  }

  // Xác nhận OTP và đổi mật khẩu mới
  @Post('reset-password')
  @ApiOperation({ summary: 'Xác nhận OTP và đổi mật khẩu mới' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        otp: { type: 'string', example: '123456' },
        newPassword: { type: 'string', example: 'newStrongPassword123!' },
      },
      required: ['email', 'otp', 'newPassword'],
    },
  })
  @ApiResponse({ status: 201, description: 'Đổi mật khẩu thành công' })
  @ApiResponse({ status: 400, description: 'Thiếu thông tin hoặc OTP không hợp lệ' })
  async resetPassword(
    @Body() body: { email?: string; otp?: string; newPassword?: string }
  ) {
    const { email, otp, newPassword } = body;
    if (!email || !otp || !newPassword)
      throw new BadRequestException('Email, OTP và mật khẩu mới là bắt buộc');

    return this.authService.resetPasswordWithOtp(email, otp, newPassword);
  }
  
}
