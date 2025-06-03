"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./users/user.entity");
const otp_entity_1 = require("./otp/otp.entity");
const user_module_1 = require("./users/user.module");
const config_1 = require("@nestjs/config");
const device_entity_1 = require("./devices/device.entity");
const game_event_entity_1 = require("./game_events/game-event.entity");
const session_entity_1 = require("./sessions/session.entity");
const room_entity_1 = require("./rooms/room.entity");
const report_entity_1 = require("./reports/report.entity");
const question_entity_1 = require("./questions/question.entity");
const match_entity_1 = require("./matches/match.entity");
const leaderboard_entity_1 = require("./leaderboard/leaderboard.entity");
const achievement_entity_1 = require("./achievements/achievement.entity");
const event_emitter_1 = require("@nestjs/event-emitter");
const match_module_1 = require("./matches/match.module");
const match_answer_entity_1 = require("./match-answers/match-answer.entity");
const match_answer_module_1 = require("./match-answers/match-answer.module");
const session_module_1 = require("./sessions/session.module");
const gemini_module_1 = require("./gemini/gemini.module");
const category_module_1 = require("./categories/category.module");
const category_entity_1 = require("./categories/category.entity");
const leaderboard_module_1 = require("./leaderboard/leaderboard.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            event_emitter_1.EventEmitterModule.forRoot(),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.DB_HOST,
                port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                ssl: {
                    rejectUnauthorized: false,
                },
                entities: [
                    user_entity_1.User,
                    device_entity_1.Device,
                    game_event_entity_1.GameEvent,
                    session_entity_1.Session,
                    room_entity_1.Room,
                    report_entity_1.Report,
                    question_entity_1.Question,
                    match_entity_1.Match,
                    leaderboard_entity_1.Leaderboard,
                    achievement_entity_1.Achievement,
                    match_answer_entity_1.MatchAnswer,
                    category_entity_1.Category,
                    otp_entity_1.Otp,
                ],
                synchronize: true,
            }),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '7d' },
            }),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            match_module_1.MatchModule,
            match_answer_module_1.MatchAnswerModule,
            session_module_1.SessionModule,
            gemini_module_1.GeminiModule,
            category_module_1.CategoryModule,
            leaderboard_module_1.LeaderboardModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map