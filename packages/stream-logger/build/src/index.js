"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStreamLogger = createStreamLogger;
const winston_1 = require("winston");
function createStreamLogger(label) {
    const logger = (0, winston_1.createLogger)({
        level: 'debug',
        format: winston_1.format.combine((0, winston_1.format)(info => {
            info.level = info.level.toUpperCase();
            return info;
        })(), winston_1.format.colorize(), winston_1.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss' }), winston_1.format.label({ label }), winston_1.format.printf(info => `[${info.timestamp}] [${info.label}] ${info.level}: ${info.message}`)),
        transports: new winston_1.transports.Console(),
    });
    return {
        info: ({ message, ...other }, ...args) => {
            let builtMessage = message;
            if (other.kickUsername) {
                builtMessage = `[kick:${other.kickUsername}] ` + builtMessage;
            }
            if (other.discordUsername) {
                builtMessage = `[discord:${other.discordUsername}] ` + builtMessage;
            }
            if (other.interactionId) {
                builtMessage = `[interactionId:${other.interactionId}] ` + builtMessage;
            }
            logger.info(builtMessage);
        },
    };
}
//# sourceMappingURL=index.js.map