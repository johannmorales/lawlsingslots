import {type GuildMember, type BaseInteraction} from 'discord.js';
import {AppDataSource} from '../db';
import {KickChannel} from '../entities/KickChannel';
import {logger} from '../logger';

export async function removeAllRolesByUser(
  interaction: BaseInteraction,
  user: GuildMember
) {
  const channels = await AppDataSource.getRepository(KickChannel).find();
  const roleManager = user.roles;
  for (const channel of channels) {
    const role = user.guild.roles.cache.find(
      role => role.id === channel.roleId
    );
    if (!role) {
      continue;
    }
    await roleManager.remove(role);
    logger.info({
      interactionId: interaction.id,
      discordUsername: interaction.user.displayName,
      message: `removed role ${role.name}`,
    });
  }
}
