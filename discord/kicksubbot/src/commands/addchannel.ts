import {CommandInteraction, SlashCommandBuilder} from 'discord.js';
import {v4 as uuidv4} from 'uuid';
import {AppDataSource} from '../db';
import {DiscordUser} from '../entities/DiscordUser';
import {KickChannel} from '../entities/KickChannel';

export const data = new SlashCommandBuilder()
  .setName('addchannel')
  .addStringOption(option =>
    option
      .setName('channel')
      .setDescription('channel to update')
      .setRequired(true)
  )
  .addRoleOption(option =>
    option
      .setName('role')
      .setDescription('role to add/remove')
      .setRequired(true)
  )
  .setDescription('Add a channel to track subs');

export async function execute(interaction: CommandInteraction) {
  const roleId = interaction.options.get('role')?.value as string;
  const channel = interaction.options.get('channel')?.value as string;
  await AppDataSource.getRepository(KickChannel).upsert(
    {
      channel,
      roleId,
    },
    {
      conflictPaths: {
        channel: true,
      },
    }
  );
  return interaction.reply({content: `Added ${channel}`, ephemeral: true});
}
