import { IoAdapter } from '@nestjs/platform-socket.io';
import * as jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';

export class JwtIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, options);

    server.use((socket: Socket, next: (err?: Error) => void) => {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error('Missing token'));
      }

      try {
        const decoded = jwt.verify(token, 'your-secret-key'); // 👈 thay bằng SECRET thực tế
        socket.data.user = decoded;
        next(); // ✅ Token hợp lệ → tiếp tục
      } catch (err) {
        next(new Error('Invalid token'));
      }
    });

    return server;
  }
}
