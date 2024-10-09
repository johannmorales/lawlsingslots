import { ButtonInteraction, CommandInteraction, ModalSubmitInteraction } from 'discord.js';
export declare const data: import("discord.js").SlashCommandOptionsOnlyBuilder;
export declare function createNeedToVerifyResponse(interaction: CommandInteraction | ModalSubmitInteraction | ButtonInteraction, uuid: string): Promise<import("discord.js").Message<boolean>>;
export declare function execute(interaction: CommandInteraction | ModalSubmitInteraction | ButtonInteraction, _kickUsername: string): Promise<import("discord.js").Message<boolean>>;
