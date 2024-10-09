import { DiscordUser } from './DiscordUser';
import { KickChannel } from './KickChannel';
export declare abstract class Sub {
    id: number;
    lastUpdatedAt: Date;
    kickChannel: KickChannel;
    discordUser: DiscordUser;
}
