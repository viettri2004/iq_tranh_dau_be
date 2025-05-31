import { IoAdapter } from '@nestjs/platform-socket.io';
import { Injectable, INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server, ServerOptions, Socket } from 'socket.io';
import cookie from 'cookie';

interface SocketWithUser extends Socket {
  user?: any;
}

@Injectable()
export class JwtSocketAdapter extends IoAdapter {
  constructor(
    private app: INestApplication,
    private readonly jwtService: JwtService,
  ) {
    super(app);
  }

  create(port: number, options?: ServerOptions): any {
    const server: Server = super.create(port, options);

    server.use(async (socket: Socket, next) => {
      try {
        const token = socket.handshake.auth?.token || this.extractToken(socket);
        if (!token) return next(new Error('Missing token'));

        const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        });

        (socket as SocketWithUser).user = payload;
        next();
      } catch (err) {
        console.error('Socket authentication error:', err);
        next(new Error('Unauthorized'));
      }
    });

    return server;
  }

  private extractToken(socket: Socket): string | null {
    const cookieHeader = socket.handshake.headers?.cookie;
    if (!cookieHeader) return null;

    const cookies = cookie.parse(cookieHeader);
    return cookies['access_token'] || null;
  }
}
