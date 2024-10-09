import { Sub } from './Sub';
export declare abstract class DiscordUser {
    id: number;
    userId: string;
    name?: string;
    kickUsername?: string | null;
    uuid: string;
    createdAt: Date;
    verifiedAt: Date | null;
    subs: Sub[];
}
