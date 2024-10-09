"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const DiscordUser_1 = require("./entities/DiscordUser");
const KickChannel_1 = require("./entities/KickChannel");
const Sub_1 = require("./entities/Sub");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'better-sqlite3',
    database: 'dc-kicksubbot.sqllite.db',
    synchronize: true,
    entities: [DiscordUser_1.DiscordUser, KickChannel_1.KickChannel, Sub_1.Sub],
    subscribers: [],
    migrations: [],
});
//# sourceMappingURL=db.js.map