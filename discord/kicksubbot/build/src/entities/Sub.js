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
exports.Sub = void 0;
const typeorm_1 = require("typeorm");
const DiscordUser_1 = require("./DiscordUser");
const KickChannel_1 = require("./KickChannel");
let Sub = class Sub {
};
exports.Sub = Sub;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Sub.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Sub.prototype, "lastUpdatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => KickChannel_1.KickChannel, kickChannel => kickChannel.subs, {
        nullable: false,
        cascade: ['insert', 'remove'],
    }),
    (0, typeorm_1.JoinColumn)({ name: 'kickChannel_id' }),
    __metadata("design:type", KickChannel_1.KickChannel)
], Sub.prototype, "kickChannel", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => DiscordUser_1.DiscordUser, discordUser => discordUser.subs, {
        nullable: false,
        cascade: ['insert', 'remove'],
    }),
    (0, typeorm_1.JoinColumn)({ name: 'discordUser_id' }),
    __metadata("design:type", DiscordUser_1.DiscordUser)
], Sub.prototype, "discordUser", void 0);
exports.Sub = Sub = __decorate([
    (0, typeorm_1.Index)('sub-unique', ['kickChannel', 'discordUser'], { unique: true }),
    (0, typeorm_1.Entity)()
], Sub);
//# sourceMappingURL=Sub.js.map