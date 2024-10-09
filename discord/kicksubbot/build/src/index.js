"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const discord_js_1 = require("discord.js");
const commands_1 = require("./commands");
const config_1 = require("./config");
const db_1 = require("./db");
const verificarsub_1 = require("./commands/verificarsub");
const DiscordUser_1 = require("./entities/DiscordUser");
const client = new discord_js_1.Client({
    intents: ['Guilds', 'GuildMessages', 'DirectMessages'],
});
client.once('ready', async (li) => {
    await db_1.AppDataSource.initialize();
    const channel = li.channels.cache.get(process.env.CHANNEL_ID);
    const confirm = new discord_js_1.ButtonBuilder()
        .setCustomId(process.env.START_BUTTON_CUSTOM_ID)
        .setLabel('Verificar Subs')
        .setStyle(discord_js_1.ButtonStyle.Success);
    const row = new discord_js_1.ActionRowBuilder().addComponents(confirm);
    // channel?.send({
    //   content: '',
    //   components: [row],
    //   embeds: [
    //     {
    //       color: 5438232,
    //       type: 'rich',
    //       description:
    //         '**VINCULACIÓN DE CUENTA DE SUB EN KICK**\n\n' +
    //         '**¿Para qué se usarán estas vinculaciones?**\n' +
    //         '> - Darte acceso a los canales exclusivos de raffles para subs.\n' +
    //         '> \n' +
    //         '> Si tenéis alguna otra duda en referencia a esto o tenéis algún problema a la hora de vincular vuestra cuenta, podéis abrir un ticket en el canal de soporte',
    //     },
    //   ],
    // });
});
client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton() &&
        interaction.customId === process.env.START_BUTTON_CUSTOM_ID) {
        const discordUser = await db_1.AppDataSource.getRepository(DiscordUser_1.DiscordUser).findOne({
            where: {
                userId: interaction.user.id,
            },
        });
        if (!discordUser) {
            const modal = new discord_js_1.ModalBuilder()
                .setCustomId(process.env.MODAL_CUSTOM_ID)
                .setTitle('Verificar Subs');
            const usernameInput = new discord_js_1.TextInputBuilder()
                .setCustomId('kickUsername')
                .setLabel('Ingresa tu usuario de Kick')
                .setStyle(discord_js_1.TextInputStyle.Short);
            const firstActionRow = new discord_js_1.ActionRowBuilder().addComponents(usernameInput);
            // @ts-ignore
            modal.addComponents(firstActionRow);
            await interaction.showModal(modal);
        }
        else {
            const modal = new discord_js_1.ModalBuilder()
                .setCustomId(process.env.MODAL_CUSTOM_ID)
                .setTitle('Verificar Subs');
            const usernameInput = new discord_js_1.TextInputBuilder()
                .setCustomId('kickUsername')
                .setLabel('Ingresa tu usuario de Kick')
                .setStyle(discord_js_1.TextInputStyle.Short)
                .setValue(discordUser.kickUsername);
            const firstActionRow = new discord_js_1.ActionRowBuilder().addComponents(usernameInput);
            modal.addComponents(firstActionRow);
            await interaction.showModal(modal);
        }
    }
    if (interaction.isModalSubmit() &&
        interaction.customId === process.env.MODAL_CUSTOM_ID) {
        return await (0, verificarsub_1.execute)(interaction, interaction.fields.getTextInputValue('kickUsername'));
    }
    if (!interaction.isCommand()) {
        return;
    }
    const { commandName } = interaction;
    if (commands_1.commands[commandName]) {
        commands_1.commands[commandName].execute(interaction);
    }
});
client.login(config_1.config.DISCORD_TOKEN);
//# sourceMappingURL=index.js.map