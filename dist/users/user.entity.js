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
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const device_entity_1 = require("../devices/device.entity");
const match_entity_1 = require("../matches/match.entity");
const room_entity_1 = require("../rooms/room.entity");
const achievement_entity_1 = require("../achievements/achievement.entity");
const report_entity_1 = require("../reports/report.entity");
const session_entity_1 = require("../sessions/session.entity");
const game_event_entity_1 = require("../game_events/game-event.entity");
const leaderboard_entity_1 = require("../leaderboard/leaderboard.entity");
let User = class User {
    id;
    google_id;
    facebook_id;
    name;
    email;
    avatar_url;
    password_hash;
    elo;
    exp;
    total_matches;
    wins;
    losses;
    created_at;
    devices;
    matchesAsPlayer1;
    matchesAsPlayer2;
    hostedRooms;
    joinedRooms;
    achievements;
    reports;
    sessions;
    gameEvents;
    leaderboardEntries;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "google_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "facebook_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "avatar_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "password_hash", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "elo", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "exp", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "total_matches", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "wins", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "losses", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => device_entity_1.Device, device => device.user),
    __metadata("design:type", Array)
], User.prototype, "devices", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => match_entity_1.Match, match => match.player1),
    __metadata("design:type", Array)
], User.prototype, "matchesAsPlayer1", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => match_entity_1.Match, match => match.player2),
    __metadata("design:type", Array)
], User.prototype, "matchesAsPlayer2", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => room_entity_1.Room, room => room.host_player),
    __metadata("design:type", Array)
], User.prototype, "hostedRooms", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => room_entity_1.Room, room => room.guest_player),
    __metadata("design:type", Array)
], User.prototype, "joinedRooms", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => achievement_entity_1.Achievement, a => a.user),
    __metadata("design:type", Array)
], User.prototype, "achievements", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => report_entity_1.Report, r => r.user),
    __metadata("design:type", Array)
], User.prototype, "reports", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => session_entity_1.Session, s => s.user),
    __metadata("design:type", Array)
], User.prototype, "sessions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => game_event_entity_1.GameEvent, e => e.user),
    __metadata("design:type", Array)
], User.prototype, "gameEvents", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => leaderboard_entity_1.Leaderboard, l => l.user),
    __metadata("design:type", Array)
], User.prototype, "leaderboardEntries", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map