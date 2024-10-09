"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
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
    interaction.options.get('channel');
    const role = interaction.options.get('role');
    return interaction.reply({ content: 'sad', ephemeral: true });
}
//# sourceMappingURL=ping.js.map