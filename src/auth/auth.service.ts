// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, NotFoundException  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { Repository } from 'typeorm/repository/Repository';
import { User } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async validateGoogle(
    idToken: string,
  ): Promise<{ token: string; user: User }> {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: [
        '880768558788-591d0v1hkonhtaom1iiq5o4v28hj6ldv.apps.googleusercontent.com', // ✅ Firebase client
        '880768558788-i9iqivufi7o7mbg88eiiik303kufj7pl.apps.googleusercontent.com', // máy 1
        '880768558788-v7v8auvbamivcbca7a5l7be9b8s7ih8h.apps.googleusercontent.com', // máy 2
      ],
    });
    const payload = ticket.getPayload();

    if (!payload) {
      throw new UnauthorizedException('Invalid Google token');
    }

    let user = await this.userRepo.findOne({
      where: { google_id: payload.sub },
    });
    if (!user) {
      user = this.userRepo.create({
        google_id: payload.sub,
        name: payload.name,
        email: payload.email,
        avatar_url: payload.picture,
      });
      await this.userRepo.save(user);
    }

    return {
      user: user,
      token: this.generateToken(user),
    };
  }

  async loginWithCredentials(
    email: string,
    password: string,
  ): Promise<{ token: string; user: User }> {
    const user = await this.userRepo.findOne({ where: { email } });

    if (
      !user ||
      !user.password_hash ||
      !(await bcrypt.compare(password, user.password_hash))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);

    return { token, user };
  }

  async register(
    email: string,
    name: string,
    password: string,
  ): Promise<{ token: string; user: User }> {
    const existingUser = await this.userRepo.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = this.userRepo.create({
      email,
      name,
      password_hash: passwordHash,
    });

    await this.userRepo.save(newUser);

    return {
      user: newUser,
      token: this.generateToken(newUser),
    };
  }

  generateToken(user: User): string {
    return this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
      },
      {
        secret: process.env.JWT_SECRET, 
        expiresIn: '1h',
      },
    );
  }
  async requestPasswordReset(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');

    const token = this.jwtService.sign(
      {
        sub: user.id,
        type: 'reset',
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      },
    );

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,      
        pass: process.env.EMAIL_PASSWORD,  
      },
    });

    await transporter.sendMail({
      from: `"Quiz Game" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Khôi phục mật khẩu',
      html: `
        <p>Chào ${user.name || 'bạn'},</p>
        <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng nhấp vào liên kết dưới đây:</p>
        <a href="${resetUrl}">Đặt lại mật khẩu</a>
        <p>Liên kết sẽ hết hạn sau 15 phút.</p>
      `,
    });

    return { message: 'Đã gửi email đặt lại mật khẩu' };
  }
}
