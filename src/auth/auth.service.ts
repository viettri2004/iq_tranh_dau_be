// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/user.entity';
import { toPlayerResponse } from 'src/common/helpers/player-response.helper';
import { Player } from 'src/common/types/player.interface';

@Injectable()
export class AuthService {
    private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
    ) { }

    async loginWithGoogle(idToken: string): Promise<{ access_token: string; user: Player }> {
        // 1. Xác thực token với Google
        const ticket = await this.googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload?.email) {
            throw new UnauthorizedException('Google token không hợp lệ');
        }

        // 2. Tìm hoặc tạo người dùng trong hệ thống
        const user = await this.usersService.findOrCreateByGoogle(payload);

        // 3. Tạo JWT riêng cho hệ thống
        const jwtPayload = { sub: user.id, email: user.email };
        const token = this.jwtService.sign(jwtPayload);

        return {
            access_token: token,
            user: toPlayerResponse(user),
        };
    }
}
