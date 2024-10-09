import { EventEmitter } from 'stream';
import { KickChannelUserProfile, Message } from 'stream-types';
export declare const subscribeToKickChat: (channel: string) => Promise<EventEmitter<{
    message: Message[];
}>>;
export type CommandHandler = (props: {
    message: Message;
    args: string[];
}) => Promise<void>;
export declare function addCommandListener(emitter: EventEmitter<{
    message: Message[];
}>, command: string, cooldown: number, handler: CommandHandler, channelId?: string, authorizationToken?: string): void;
export declare function kickSendMessage(channelId: string, authorizationToken: string, message: string): Promise<void>;
export declare function kickSendReply(channelId: string, authorizationToken: string, originalMessage: Message, content: string): Promise<void>;
export declare function kickChatBan(authorizationToken: string, channel: string, username: string, duration?: number): Promise<void>;
export declare function kickIsOnline(channelId: string): Promise<boolean>;
export declare function unmod(authorizationToken: string, channel: string, mod: string): Promise<void>;
export declare function getKickProfileForChannel(channel: string, username: string): Promise<any>;
export declare function getKickChannel(channel: string): Promise<KickChannelUserProfile | null>;
export declare function getKickIsUserSub(channel: string, username: string): Promise<boolean>;
//# sourceMappingURL=index.d.ts.map