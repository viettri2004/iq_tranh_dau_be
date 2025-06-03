import { AuthService } from 'src/auth/auth.service';
import { GoogleLoginDto } from 'src/common//dto/google-login.dto';
import { LoginDto } from 'src/common/dto/login.dto';
import { RegisterDto } from 'src/common/dto/register.dto';
import { UserDto } from 'src/common/dto/user.dto';
import { Session } from 'src/sessions/session.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
export declare class AuthController {
    private readonly authService;
    private readonly sessionRepo;
    constructor(authService: AuthService, sessionRepo: Repository<Session>);
    loginGoogle(req: Request, dto: GoogleLoginDto): Promise<{
        accessToken: string;
        user: UserDto;
    }>;
    loginLocal(req: Request, dto: LoginDto): Promise<{
        accessToken: string;
        user: UserDto;
    }>;
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        user: UserDto;
    }>;
    forgotPassword(body: {
        email?: string;
    }): Promise<{
        message: string;
    }>;
    resetPassword(body: {
        email?: string;
        otp?: string;
        newPassword?: string;
    }): Promise<{
        message: string;
    }>;
}
