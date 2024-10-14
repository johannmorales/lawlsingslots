// @ts-nocheck
import {
  ButtonInteraction,
  CacheType,
  CommandInteraction,
  GuildMemberRoleManager,
  ModalSubmitInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import {v4 as uuidv4} from 'uuid';
import {AppDataSource} from '../db';
import {DiscordUser} from '../entities/DiscordUser';
import {getKickChannel, getKickIsUserSub, kickChatBan} from 'kick';
import {KickChannel} from '../entities/KickChannel';
import {logger} from '../logger';

export const data = new SlashCommandBuilder()
  .setName('verificarsub')
  .addStringOption(option =>
    option.setName('username').setDescription('kick user id').setRequired(false)
  )
  .setDescription('Verifica tus subs a los canales de la grieta');

export async function createNeedToVerifyResponse(
  interaction: CommandInteraction | ModalSubmitInteraction | ButtonInteraction,
  uuid: string
) {
  await removeRoles(interaction);
  return interaction.editReply({
    content: `Primero configura tu cuenta:\n- Ve a https://kick.com/dashboard/settings/profile\n- Edita tu bio y pon \`${createKey(uuid)}\`\n- Vuelve a darle click a Verificar Subs`,
  });
}

export async function execute(
  interaction: CommandInteraction | ModalSubmitInteraction | ButtonInteraction,
  _kickUsername: string
) {
  logger.info({
    interactionId: interaction.id,
    discordUsername: interaction.user.displayName,
    message: `Attempts to verify`,
  });
  await interaction.deferReply({ephemeral: true});
  try {
    const user = interaction.user;

    const repository = AppDataSource.getRepository(DiscordUser);
    const discordUser = await repository.findOne({
      where: {
        userId: interaction.user.id,
      },
    });

    const kickUsername = _kickUsername.replace('_', '-');
    const profile = await getKickChannel(kickUsername);

    if (!profile) {
      logger.info({
        interactionId: interaction.id,
        kickUsername,
        discordUsername: interaction.user.displayName,
        message: 'unknown kick username',
      });
      return interaction.editReply({
        content: `Usuario de Kick \`${kickUsername}\` no existe`,
      });
    }

    if (!discordUser) {
      const uuid = uuidv4();
      logger.info({
        interactionId: interaction.id,
        kickUsername,
        discordUsername: interaction.user.displayName,
        message: `need to verify because new [uuid:${uuid}]`,
      });
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
      const uuid = uuidv4();
      repository.update(
        {id: discordUser.id},
        {
          uuid,
          name: user.username,
          verifiedAt: null,
          kickUsername,
        }
      );
      logger.info({
        interactionId: interaction.id,
        kickUsername,
        discordUsername: interaction.user.displayName,
        message: `need to verify because changing username [old:${discordUser.kickUsername}] [uuid:${uuid}]`,
      });
      return createNeedToVerifyResponse(interaction, uuid);
    }

    const hasUuidInBio = profile.user?.bio?.includes(
      createKey(discordUser.uuid)
    );
    if (
      discordUser &&
      !discordUser.verifiedAt &&
      discordUser.kickUsername === kickUsername &&
      !hasUuidInBio
    ) {
      logger.info({
        interactionId: interaction.id,
        kickUsername,
        discordUsername: interaction.user.displayName,
        message: `need to verify because uuid is not valid [uuid:${discordUser.uuid}]`,
      });
      return createNeedToVerifyResponse(interaction, discordUser.uuid);
    }

    const notVerifiedButUuidInBio =
      discordUser &&
      !discordUser.verifiedAt &&
      discordUser.kickUsername === kickUsername &&
      hasUuidInBio;

    const verified =
      discordUser &&
      discordUser.verifiedAt &&
      discordUser.kickUsername === kickUsername;

    if (notVerifiedButUuidInBio || verified) {
      logger.info({
        interactionId: interaction.id,
        kickUsername,
        discordUsername: interaction.user.displayName,
        message: `valid kick user [uuid:${discordUser.uuid}]`,
      });
      if (notVerifiedButUuidInBio) {
        await repository.update(
          {
            userId: user.id,
          },
          {
            kickUsername,
            verifiedAt: new Date(),
          }
        );
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
  } catch (error) {
    logger.error({
      interactionId: interaction.id,
      discordUsername: interaction.user.displayName,
      message: error.message,
    });
    console.error(error);
    return interaction.editReply({
      content: 'Error desconocido. Vuelve a intentarlo',
    });
  }
}

async function removeRoles(
  interaction:
    | CommandInteraction<CacheType>
    | ModalSubmitInteraction<CacheType>
    | ButtonInteraction<CacheType>
) {
  const channels = await AppDataSource.getRepository(KickChannel).find();
  const roleManager = interaction.member?.roles as GuildMemberRoleManager;
  for (const channel of channels) {
    const role = interaction.guild?.roles.cache.find(
      (role: any) => role.id === channel.roleId
    );
    if (!role) {
      continue;
    }
    await roleManager.remove(role);
  }
}

function createKey(uuid: string) {
  return `[kicksubbot::${uuid.toString()}]`;
}

async function validateChannelSubs(props: {
  interaction:
    | CommandInteraction<CacheType>
    | ModalSubmitInteraction<CacheType>
    | ButtonInteraction<CacheType>;
  kickUsername: string;
  discordUser: DiscordUser;
}) {
  const {interaction, kickUsername, discordUser} = props;
  const channels = await AppDataSource.getRepository(KickChannel).find();
  await interaction.guild?.roles.fetch();
  const roleManager = interaction.member?.roles as GuildMemberRoleManager;
  const roles = [];
  for (const channel of channels) {
    const role = interaction.guild?.roles.cache.find(
      (role: any) => role.id === channel.roleId
    );

    if (!role) {
      continue;
    }
    try {
      const isSub = await getKickIsUserSub(channel.channel, kickUsername);
      logger.info({
        interactionId: interaction.id,
        kickUsername,
        discordUsername: interaction.user.displayName,
        message: `has sub in ${channel.channel}:${isSub}`,
      });
      if (isSub) {
        await roleManager.add(role);
        roles.push(role);
      } else {
        await roleManager.remove(role);
      }
    } catch (error) {
      console.error(discordUser, channel, error);
    }
  }

  return roles;
}
