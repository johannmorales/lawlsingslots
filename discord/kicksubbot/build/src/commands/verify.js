"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const uuid_1 = require("uuid");
const db_1 = require("../db");
const DiscordUser_1 = require("../entities/DiscordUser");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('verify')
    .addStringOption(option => option.setName('username').setDescription('kick user id').setRequired(true))
    .setDescription('Replies with Pong!');
async function execute(interaction) {
    const kickUsername = interaction.options.get('username')?.value;
    const user = interaction.user;
    if (!kickUsername)
        return;
    const repository = db_1.AppDataSource.getRepository(DiscordUser_1.DiscordUser);
    const discordUser = await repository.findOne({
        where: {
            userId: interaction.user.id,
        },
    });
    if (!discordUser) {
        const uuid = (0, uuid_1.v4)();
        repository.insert({
            userId: user.id,
            name: user.username,
            uuid,
            kickUsername,
            verifiedAt: null,
        });
        return interaction.reply({
            content: `Primero configura tu cuenta.\n- Ve a https://kick.com/dashboard/settings/profile\n- Edita tu bio y pon \`[kicksubbot::${uuid.toString()}\`]\n- Vuelve a llamar a este comando`,
            ephemeral: true,
        });
    }
    else if (discordUser && !discordUser.verifiedAt) {
        await repository.update({ userId: user.id }, {
            kickUsername,
        });
        const uuid = discordUser.uuid;
        return interaction.reply({
            content: `Primero configura tu cuenta.\n- Ve a https://kick.com/dashboard/settings/profile\n- Edita tu bio y pon \`[kicksubbot::${uuid.toString()}\`]\n- Vuelve a llamar a este comando`,
            ephemeral: true,
        });
    }
    else if (discordUser && discordUser.verifiedAt) {
        return true;
    }
    return true;
}
//# sourceMappingURL=verify.js.map