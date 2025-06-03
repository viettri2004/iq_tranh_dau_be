import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Session } from 'src/sessions/session.entity';
import { Repository } from 'typeorm';
export declare class JwtAuthGuard implements CanActivate {
    private readonly jwtService;
    private readonly sessionRepo;
    constructor(jwtService: JwtService, sessionRepo: Repository<Session>);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
