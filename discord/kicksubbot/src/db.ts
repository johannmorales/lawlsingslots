import {DataSource} from 'typeorm';
import {DiscordUser} from './entities/DiscordUser';
import {KickChannel} from './entities/KickChannel';
import {Sub} from './entities/Sub';

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: 'dc-kicksubbot.sqllite.db',
  synchronize: true,
  entities: [DiscordUser, KickChannel, Sub],
  subscribers: [],
  migrations: [],
});
