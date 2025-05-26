import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/user.entity';
export declare class AuthService {
    private readonly jwtService;
    private readonly usersService;
    private googleClient;
    constructor(jwtService: JwtService, usersService: UsersService);
    loginWithGoogle(idToken: string): Promise<{
        access_token: string;
        user: UserEntity;
    }>;
}
