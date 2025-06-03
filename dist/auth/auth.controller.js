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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("@nestjs/typeorm");
const class_transformer_1 = require("class-transformer");
const auth_service_1 = require("./auth.service");
const google_login_dto_1 = require("../common/dto/google-login.dto");
const login_dto_1 = require("../common/dto/login.dto");
const register_dto_1 = require("../common/dto/register.dto");
const user_dto_1 = require("../common/dto/user.dto");
const session_entity_1 = require("../sessions/session.entity");
const typeorm_2 = require("typeorm");
let AuthController = class AuthController {
    authService;
    sessionRepo;
    constructor(authService, sessionRepo) {
        this.authService = authService;
        this.sessionRepo = sessionRepo;
    }
    async loginGoogle(req, dto) {
        const { token, user } = await this.authService.validateGoogle(dto.idToken);
        console.log(dto.idToken);
        await this.sessionRepo.save({
            jwt_token: token,
            device_info: req.headers['user-agent'] || 'unknown',
            login_time: new Date(),
            is_active: true,
            user: user,
            ip_address: req.ip || req.connection.remoteAddress || 'unknown',
        });
        return {
            accessToken: token,
            user: (0, class_transformer_1.plainToInstance)(user_dto_1.UserDto, user, {
                excludeExtraneousValues: true,
            }),
        };
    }
    async loginLocal(req, dto) {
        const { token, user } = await this.authService.loginWithCredentials(dto.email, dto.password);
        await this.sessionRepo.save({
            jwt_token: token,
            device_info: req.headers['user-agent'] || 'unknown',
            login_time: new Date(),
            is_active: true,
            user: user,
            ip_address: req.ip || req.connection.remoteAddress || 'unknown',
        });
        return {
            accessToken: token,
            user: (0, class_transformer_1.plainToInstance)(user_dto_1.UserDto, user, {
                excludeExtraneousValues: true,
            }),
        };
    }
    async register(dto) {
        const { token, user } = await this.authService.register(dto.email, dto.name, dto.password);
        return {
            accessToken: token,
            user: (0, class_transformer_1.plainToInstance)(user_dto_1.UserDto, user, { excludeExtraneousValues: true }),
        };
    }
    async forgotPassword(body) {
        const { email } = body;
        if (!email)
            throw new common_1.BadRequestException('Email là bắt buộc');
        return this.authService.requestPasswordReset(email);
    }
    async resetPassword(body) {
        const { email, otp, newPassword } = body;
        if (!email || !otp || !newPassword)
            throw new common_1.BadRequestException('Email, OTP và mật khẩu mới là bắt buộc');
        return this.authService.resetPasswordWithOtp(email, otp, newPassword);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_2.Post)('google'),
    (0, swagger_1.ApiOperation)({ summary: 'Đăng nhập bằng Google ID Token' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Đăng nhập thành công, trả về JWT' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'ID Token không hợp lệ' }),
    __param(0, (0, common_2.Req)()),
    __param(1, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, google_login_dto_1.GoogleLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginGoogle", null);
__decorate([
    (0, common_2.Post)('login'),
    (0, swagger_1.ApiOperation)({
        summary: 'Đăng nhập bằng email & password (tài khoản nội bộ)',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Đăng nhập thành công, trả về JWT' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Sai email hoặc mật khẩu' }),
    __param(0, (0, common_2.Req)()),
    __param(1, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginLocal", null);
__decorate([
    (0, common_2.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Đăng ký tài khoản nội bộ' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Đăng ký thành công, trả về JWT' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Email đã được sử dụng' }),
    __param(0, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_2.Post)('forgot-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Gửi OTP để đặt lại mật khẩu qua email' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'user@example.com' },
            },
            required: ['email'],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'OTP đã được gửi tới email' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Email là bắt buộc' }),
    __param(0, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_2.Post)('reset-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Xác nhận OTP và đổi mật khẩu mới' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'user@example.com' },
                otp: { type: 'string', example: '123456' },
                newPassword: { type: 'string', example: 'newStrongPassword123!' },
            },
            required: ['email', 'otp', 'newPassword'],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Đổi mật khẩu thành công' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Thiếu thông tin hoặc OTP không hợp lệ',
    }),
    __param(0, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_2.Controller)('auth'),
    __param(1, (0, typeorm_1.InjectRepository)(session_entity_1.Session)),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        typeorm_2.Repository])
], AuthController);
//# sourceMappingURL=auth.controller.js.map