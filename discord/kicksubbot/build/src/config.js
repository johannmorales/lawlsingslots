"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
require("dotenv/config");
const { DISCORD_TOKEN, DISCORD_CLIENT_ID } = process.env;
if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
    throw new Error('Missing environment variables');
}
exports.config = {
    DISCORD_TOKEN,
    DISCORD_CLIENT_ID,
};
//# sourceMappingURL=config.js.map