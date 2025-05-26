import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GoogleLoginDto } from '../common/dto/google-login.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('google')
    @ApiOperation({ summary: 'Đăng nhập bằng Google ID Token' })
    @ApiResponse({ status: 201, description: 'Đăng nhập thành công, trả về JWT' })
    @ApiResponse({ status: 400, description: 'Thiếu hoặc sai idToken' })
    async loginWithGoogle(@Body() dto: GoogleLoginDto) {
        return this.authService.loginWithGoogle(dto.idToken);
    }
}
