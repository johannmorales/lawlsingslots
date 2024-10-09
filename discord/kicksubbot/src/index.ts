import {
  ActionRowBuilder,
  Client,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import {commands} from './commands';
import {config} from './config';
import {AppDataSource} from './db';
import {execute} from './commands/verificarsub';
import {DiscordUser} from './entities/DiscordUser';
import {logger} from './logger';

const client = new Client({
  intents: ['Guilds', 'GuildMessages', 'DirectMessages'],
});

client.once('ready', async li => {
  await AppDataSource.initialize();
  logger.info({message: 'Running! 🚀'});
  // const channel = li.channels.cache.get(process.env.CHANNEL_ID!);
  // const confirm = new ButtonBuilder()
  //   .setCustomId(process.env.START_BUTTON_CUSTOM_ID!)
  //   .setLabel('Verificar Subs')
  //   .setStyle(ButtonStyle.Success);
  // const row = new ActionRowBuilder().addComponents(confirm);
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

client.on('interactionCreate', async interaction => {
  if (
    interaction.isButton() &&
    interaction.customId === process.env.START_BUTTON_CUSTOM_ID
  ) {
    const discordUser = await AppDataSource.getRepository(DiscordUser).findOne({
      where: {
        userId: interaction.user.id,
      },
    });
    if (!discordUser) {
      const modal = new ModalBuilder()
        .setCustomId(process.env.MODAL_CUSTOM_ID!)
        .setTitle('Verificar Subs');
      const usernameInput = new TextInputBuilder()
        .setCustomId('kickUsername')
        .setLabel('Ingresa tu usuario de Kick')
        .setStyle(TextInputStyle.Short);
      const firstActionRow = new ActionRowBuilder().addComponents(
        usernameInput
      );
      modal.addComponents(firstActionRow);
      await interaction.showModal(modal);
    } else {
      const modal = new ModalBuilder()
        .setCustomId(process.env.MODAL_CUSTOM_ID!)
        .setTitle('Verificar Subs');
      const usernameInput = new TextInputBuilder()
        .setCustomId('kickUsername')
        .setLabel('Ingresa tu usuario de Kick')
        .setStyle(TextInputStyle.Short)
        .setValue(discordUser.kickUsername!);
      const firstActionRow = new ActionRowBuilder().addComponents(
        usernameInput
      );
      modal.addComponents(firstActionRow);
      await interaction.showModal(modal);
    }
  }

  if (
    interaction.isModalSubmit() &&
    interaction.customId === process.env.MODAL_CUSTOM_ID
  ) {
    return await execute(
      interaction,
      interaction.fields.getTextInputValue('kickUsername')
    );
  }

  if (!interaction.isCommand()) {
    return;
  }
  const {commandName} = interaction;
  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction);
  }
});

client.login(config.DISCORD_TOKEN);
