import {createLogger, format, transports} from 'winston';
type Log = {
  interactionId?: string;
  kickUsername?: string;
  discordId?: string;
  discordUsername?: string;
  message: string;
};
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
    info: ({message, ...other}: Log, ...args: any[]) => {
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
