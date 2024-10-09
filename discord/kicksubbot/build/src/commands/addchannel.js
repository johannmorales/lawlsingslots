"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const db_1 = require("../db");
const KickChannel_1 = require("../entities/KickChannel");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('addchannel')
    .addStringOption(option => option
    .setName('channel')
    .setDescription('channel to update')
    .setRequired(true))
    .addRoleOption(option => option
    .setName('role')
    .setDescription('role to add/remove')
    .setRequired(true))
    .setDescription('Replies with Pong!');
async function execute(interaction) {
    const roleId = interaction.options.get('role')?.value;
    const channel = interaction.options.get('channel')?.value;
    await db_1.AppDataSource.getRepository(KickChannel_1.KickChannel).upsert({
        channel,
        roleId,
    }, {
        conflictPaths: {
            channel: true,
        },
    });
    return interaction.reply({ content: `Added ${channel}`, ephemeral: true });
}
//# sourceMappingURL=addchannel.js.map