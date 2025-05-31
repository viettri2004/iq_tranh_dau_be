import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from 'src/sessions/session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Session) // ✅ inject đúng repo
    private readonly sessionRepo: Repository<Session>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers['authorization'];

    if (!auth?.startsWith('Bearer ')) throw new UnauthorizedException();

    const token = auth.slice(7);
    const payload = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET, // BẮT BUỘC nếu dùng jwt.verify trực tiếp
    });

    const session = await this.sessionRepo.findOne({
      where: { jwt_token: token, is_active: true },
      relations: ['user'],
    });

    if (!session) throw new UnauthorizedException('Session expired or invalid');

    req.user = session.user;
    req.session = session;
    return true;
  }
}
