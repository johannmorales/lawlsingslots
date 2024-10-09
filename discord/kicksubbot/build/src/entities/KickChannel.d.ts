import { Sub } from './Sub';
export declare abstract class KickChannel {
    id: number;
    channel: string;
    roleId: string;
    subs: Sub[];
}
