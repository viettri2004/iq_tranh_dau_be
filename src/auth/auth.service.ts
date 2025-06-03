// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { Repository } from 'typeorm/repository/Repository';
import { User } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { randomInt } from 'crypto';
import { Otp } from 'src/otp/otp.entity';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Otp) private readonly otpRepo: Repository<Otp>,
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
    if (!user.password_hash)
      throw new BadRequestException('Người dùng không dùng mật khẩu');
    // Tạo OTP 6 chữ số ngẫu nhiên
    const otpCode = randomInt(100000, 999999).toString();

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 phút

    // Xoá các OTP cũ của user (nếu cần)
    await this.otpRepo.delete({ user: { id: user.id } });

    // Tạo và lưu OTP mới
    const otp = this.otpRepo.create({
      code: otpCode,
      expires_at: expiresAt,
      user,
      used: false,
    });
    await this.otpRepo.save(otp);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Quiz Game" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Mã OTP đặt lại mật khẩu',
      html: `
        <p>Chào ${user.name || 'bạn'},</p>
        <p>Bạn đã yêu cầu đặt lại mật khẩu. Mã OTP của bạn là:</p>
        <h2>${otpCode}</h2>
        <p>Mã này sẽ hết hạn sau 15 phút.</p>
      `,
    });

    return { message: 'Đã gửi mã OTP đến email của bạn' };
  }

  async resetPasswordWithOtp(
    email: string,
    otpCode: string,
    newPassword: string,
  ) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');

    const otp = await this.otpRepo.findOne({
      where: {
        user: { id: user.id },
        code: otpCode,
        used: false,
      },
    });

    if (!otp) {
      throw new BadRequestException('Mã OTP không hợp lệ');
    }

    if (otp.expires_at < new Date()) {
      throw new BadRequestException('Mã OTP đã hết hạn');
    }

    // Đặt lại mật khẩu
    user.password_hash = await bcrypt.hash(newPassword, 10);
    await this.userRepo.save(user);

    // Đánh dấu OTP đã dùng
    otp.used = true;
    await this.otpRepo.save(otp);

    return { message: 'Đặt lại mật khẩu thành công' };
  }
}
