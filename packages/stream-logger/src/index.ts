import {createLogger, format, transports} from 'winston';
type Log = {
  interactionId?: string;
  kickUsername?: string;
  discordId?: string;
  discordUsername?: string;
  message: string;
};

function addTags(message: string, obj: Log, tags: [keyof Log, string][]) {
  let result = message;
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    const component = createTag(obj, tag[0], tag[1]);
    if (component) result = component + result;
  }
  return result;
}

function createTag(obj: Log, tag: keyof Log, name: string) {
  if (obj[tag] === undefined) {
    return null;
  } else {
    return `[${name}:${obj[tag]}] `;
  }
}

export function createStreamLogger(label: string) {
  const logger = createLogger({
    level: 'debug',
    format: format.combine(
      format(info => {
        info.level = info.level.toUpperCase();
        return info;
      })(),
      format.colorize(),
      format.timestamp({format: 'YYYY-MM-DDTHH:mm:ss'}),
      format.label({label}),
      format.printf(
        info =>
          `[${info.timestamp}] [${info.label}] ${info.level}: ${info.message}`
      )
    ),
    transports: new transports.Console(),
  });

  return {
    info: (log: Log) => {
      const {message} = log;
      logger.info(
        addTags(message, log, [
          ['kickUsername', 'kick'],
          ['discordUsername', 'dc'],
          ['interactionId', 'id'],
        ])
      );
    },
    error: (log: Log) => {
      const {message} = log;
      logger.error(
        addTags(message, log, [
          ['kickUsername', 'kick'],
          ['discordUsername', 'dc'],
          ['interactionId', 'id'],
        ])
      );
    },
  };
}
