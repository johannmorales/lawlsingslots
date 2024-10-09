"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.createNeedToVerifyResponse = createNeedToVerifyResponse;
exports.execute = execute;
// @ts-nocheck
const discord_js_1 = require("discord.js");
const uuid_1 = require("uuid");
const db_1 = require("../db");
const DiscordUser_1 = require("../entities/DiscordUser");
const kick_chat_1 = require("kick-chat");
const KickChannel_1 = require("../entities/KickChannel");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('verificarsub')
    .addStringOption(option => option.setName('username').setDescription('kick user id').setRequired(false))
    .setDescription('Verifica tus subs a los canales de la grieta');
async function createNeedToVerifyResponse(interaction, uuid) {
    await removeRoles(interaction);
    return interaction.editReply({
        content: `Primero configura tu cuenta:\n- Ve a https://kick.com/dashboard/settings/profile\n- Edita tu bio y pon \`${createKey(uuid)}\`\n- Vuelve a darle click a Verificar Subs`,
    });
}
async function execute(interaction, _kickUsername) {
    await interaction.deferReply({ ephemeral: true });
    try {
        const user = interaction.user;
        const repository = db_1.AppDataSource.getRepository(DiscordUser_1.DiscordUser);
        const discordUser = await repository.findOne({
            where: {
                userId: interaction.user.id,
            },
        });
        const kickUsername = _kickUsername.replace('_', '-');
        const profile = await (0, kick_chat_1.getKickChannel)(kickUsername);
        if (!profile) {
            return interaction.editReply({
                content: `Usuario de Kick \`${kickUsername}\` no existe`,
            });
        }
        if (!discordUser) {
            const uuid = (0, uuid_1.v4)();
            repository.insert({
                userId: user.id,
                name: user.username,
                uuid,
                verifiedAt: null,
                kickUsername,
            });
            return createNeedToVerifyResponse(interaction, uuid);
        }
        if (discordUser && discordUser.kickUsername !== kickUsername) {
            const uuid = (0, uuid_1.v4)();
            repository.update({ id: discordUser.id }, {
                uuid,
                name: user.username,
                verifiedAt: null,
                kickUsername,
            });
            return createNeedToVerifyResponse(interaction, uuid);
        }
        const hasUuidInBio = profile.user?.bio?.includes(createKey(discordUser.uuid));
        if (discordUser &&
            !discordUser.verifiedAt &&
            discordUser.kickUsername === kickUsername &&
            !hasUuidInBio) {
            return createNeedToVerifyResponse(interaction, discordUser.uuid);
        }
        const notVerifiedButUuidInBio = discordUser &&
            !discordUser.verifiedAt &&
            discordUser.kickUsername === kickUsername &&
            hasUuidInBio;
        const verified = discordUser &&
            discordUser.verifiedAt &&
            discordUser.kickUsername === kickUsername;
        if (notVerifiedButUuidInBio || verified) {
            if (notVerifiedButUuidInBio) {
                await repository.update({
                    userId: user.id,
                }, {
                    kickUsername,
                    verifiedAt: new Date(),
                });
            }
            const roles = await validateChannelSubs({
                interaction,
                kickUsername,
                discordUser,
            });
            return interaction.editReply({
                content: `Subs verificadas: ${roles.map(item => `<@&${item.id}>`).join(', ')}`,
            });
        }
        return interaction.editReply({
            content: 'Error inesperado, contactar a soporte',
        });
    }
    catch (error) {
        return interaction.editReply({
            content: 'Error desconocido. Vuelve a intentarlo',
        });
    }
}
async function removeRoles(interaction) {
    const channels = await db_1.AppDataSource.getRepository(KickChannel_1.KickChannel).find();
    const roleManager = interaction.member?.roles;
    for (const channel of channels) {
        const role = interaction.guild?.roles.cache.find((role) => role.id === channel.roleId);
        if (!role) {
            continue;
        }
        await roleManager.remove(role);
    }
}
function createKey(uuid) {
    return `[kicksubbot::${uuid.toString()}]`;
}
async function validateChannelSubs(props) {
    const { interaction, kickUsername, discordUser } = props;
    const channels = await db_1.AppDataSource.getRepository(KickChannel_1.KickChannel).find();
    await interaction.guild?.roles.fetch();
    const roleManager = interaction.member?.roles;
    const roles = [];
    for (const channel of channels) {
        const role = interaction.guild?.roles.cache.find((role) => role.id === channel.roleId);
        if (!role) {
            continue;
        }
        try {
            const isSub = await (0, kick_chat_1.getKickIsUserSub)(channel.channel, kickUsername);
            if (isSub) {
                await roleManager.add(role);
                roles.push(role);
            }
            else {
                await roleManager.remove(role);
            }
        }
        catch (error) {
            console.error(discordUser, channel, error);
        }
    }
    return roles;
}
//# sourceMappingURL=verificarsub.js.map