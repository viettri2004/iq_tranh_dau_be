import { GoogleLoginDto } from '../common/dto/google-login.dto';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    loginWithGoogle(dto: GoogleLoginDto): Promise<{
        access_token: string;
        user: import("../users/user.entity").UserEntity;
    }>;
}
