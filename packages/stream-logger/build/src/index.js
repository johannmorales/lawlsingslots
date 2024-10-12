"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStreamLogger = createStreamLogger;
const winston_1 = require("winston");
function addTags(message, obj, tags) {
    let result = message;
    for (let i = 0; i < tags.length; i++) {
        const tag = tags[i];
        const component = createTag(obj, tag[0], tag[1]);
        if (component)
            result = component + result;
    }
    return result;
}
function createTag(obj, tag, name) {
    if (obj[tag] === undefined) {
        return null;
    }
    else {
        return `[${name}:${obj[tag]}] `;
    }
}
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
        info: (log) => {
            const { message } = log;
            logger.info(addTags(message, log, [
                ['kickUsername', 'kick'],
                ['discordUsername', 'dc'],
                ['interactionId', 'id'],
            ]));
        },
        error: (log) => {
            const { message } = log;
            logger.error(addTags(message, log, [
                ['kickUsername', 'kick'],
                ['discordUsername', 'dc'],
                ['interactionId', 'id'],
            ]));
        },
    };
}
//# sourceMappingURL=index.js.map