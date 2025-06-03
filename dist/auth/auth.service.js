"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const google_auth_library_1 = require("google-auth-library");
const Repository_1 = require("typeorm/repository/Repository");
const user_entity_1 = require("../users/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const bcrypt = require("bcrypt");
const common_2 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const crypto_1 = require("crypto");
const otp_entity_1 = require("../otp/otp.entity");
let AuthService = class AuthService {
    jwtService;
    userRepo;
    otpRepo;
    constructor(jwtService, userRepo, otpRepo) {
        this.jwtService = jwtService;
        this.userRepo = userRepo;
        this.otpRepo = otpRepo;
    }
    async validateGoogle(idToken) {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: [
                '880768558788-591d0v1hkonhtaom1iiq5o4v28hj6ldv.apps.googleusercontent.com',
                '880768558788-i9iqivufi7o7mbg88eiiik303kufj7pl.apps.googleusercontent.com',
                '880768558788-v7v8auvbamivcbca7a5l7be9b8s7ih8h.apps.googleusercontent.com',
            ],
        });
        const payload = ticket.getPayload();
        if (!payload) {
            throw new common_1.UnauthorizedException('Invalid Google token');
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
    async loginWithCredentials(email, password) {
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user ||
            !user.password_hash ||
            !(await bcrypt.compare(password, user.password_hash))) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const token = this.generateToken(user);
        return { token, user };
    }
    async register(email, name, password) {
        const existingUser = await this.userRepo.findOne({ where: { email } });
        if (existingUser) {
            throw new common_2.ConflictException('Email already in use');
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
    generateToken(user) {
        return this.jwtService.sign({
            sub: user.id,
            email: user.email,
            name: user.name,
        }, {
            secret: process.env.JWT_SECRET,
            expiresIn: '1h',
        });
    }
    async requestPasswordReset(email) {
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user)
            throw new common_1.NotFoundException('Không tìm thấy người dùng');
        if (!user.password_hash)
            throw new common_1.BadRequestException('Người dùng không dùng mật khẩu');
        const otpCode = (0, crypto_1.randomInt)(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        await this.otpRepo.delete({ user: { id: user.id } });
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
            secure: false,
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
    async resetPasswordWithOtp(email, otpCode, newPassword) {
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user)
            throw new common_1.NotFoundException('Không tìm thấy người dùng');
        const otp = await this.otpRepo.findOne({
            where: {
                user: { id: user.id },
                code: otpCode,
                used: false,
            },
        });
        if (!otp) {
            throw new common_1.BadRequestException('Mã OTP không hợp lệ');
        }
        if (otp.expires_at < new Date()) {
            throw new common_1.BadRequestException('Mã OTP đã hết hạn');
        }
        user.password_hash = await bcrypt.hash(newPassword, 10);
        await this.userRepo.save(user);
        otp.used = true;
        await this.otpRepo.save(otp);
        return { message: 'Đặt lại mật khẩu thành công' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(otp_entity_1.Otp)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        Repository_1.Repository,
        Repository_1.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map