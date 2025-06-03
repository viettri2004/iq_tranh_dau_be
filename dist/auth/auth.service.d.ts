import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm/repository/Repository';
import { User } from 'src/users/user.entity';
import { Otp } from 'src/otp/otp.entity';
export declare class AuthService {
    private readonly jwtService;
    private readonly userRepo;
    private readonly otpRepo;
    constructor(jwtService: JwtService, userRepo: Repository<User>, otpRepo: Repository<Otp>);
    validateGoogle(idToken: string): Promise<{
        token: string;
        user: User;
    }>;
    loginWithCredentials(email: string, password: string): Promise<{
        token: string;
        user: User;
    }>;
    register(email: string, name: string, password: string): Promise<{
        token: string;
        user: User;
    }>;
    generateToken(user: User): string;
    requestPasswordReset(email: string): Promise<{
        message: string;
    }>;
    resetPasswordWithOtp(email: string, otpCode: string, newPassword: string): Promise<{
        message: string;
    }>;
}
