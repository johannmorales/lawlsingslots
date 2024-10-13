import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, GatewayIntentBits } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Currency } from 'stream-types';
import { HuntsService } from 'src/hunts/hunts.service';
import { createSlotsMap } from 'slots';

const { mapById, nameToId, names } = createSlotsMap();

@Injectable()
export class DiscordService implements OnModuleInit {
  private client: Client;
  private fzf: any;

  constructor(private bonusesService: HuntsService) {}

  async onModuleInit() {
    const { Fzf } = await (eval(`import('fzf')`) as Promise<
      typeof import('fzf')
    >);
    this.fzf = new Fzf(names);
    this.client = new Client({ intents: [GatewayIntentBits.Guilds] });

    const commands = [
      {
        name: 'huntstart',
        description: 'Start a new hunt',
        options: [
          {
            type: 4, // INTEGER
            name: 'start',
            description: 'Starting amount',
            required: true,
          },
          {
            type: 3, // STRING
            name: 'currency',
            description: 'Currency (USD, NGN, NZD)',
            required: true,
            choices: [
              { name: 'USD', value: Currency.USD },
              { name: 'NGN', value: Currency.NGN },
              { name: 'NZD', value: Currency.NZD },
            ],
          },
        ],
      },
      {
        name: 'bonus',
        description: 'Add a bonus to the current hunt',
        options: [
          {
            type: 3, // STRING
            name: 'slotname',
            description: 'The name of the slot',
            required: true,
          },
          {
            type: 4, // INTEGER
            name: 'bet',
            description: 'The bet amount',
            required: true,
          },
          {
            type: 3, // STRING
            name: 'currency',
            description: 'The currency (USD, NGN, NZD)',
            required: true,
            choices: [
              { name: 'USD', value: Currency.USD },
              { name: 'NGN', value: Currency.NGN },
              { name: 'NZD', value: Currency.NZD },
            ],
          },
        ],
      },
      {
        name: 'huntend',
        description: 'End the current hunt',
      },
      {
        name: 'payout',
        description: 'Update the payout for a bonus',
        options: [
          {
            type: 3, // STRING
            name: 'slotname',
            description: 'The name of the slot',
            required: true,
          },
          {
            type: 4, // INTEGER
            name: 'win',
            description: 'The win amount',
            required: true,
          },
          {
            type: 3, // STRING
            name: 'currency',
            description: 'The currency (optional)',
            required: false,
            choices: [
              { name: 'USD', value: Currency.USD },
              { name: 'NGN', value: Currency.NGN },
              { name: 'NZD', value: Currency.NZD },
            ],
          },
        ],
      },
    ];

    this.client.once('ready', async () => {
      const rest = new REST({ version: '10' }).setToken(
        process.env.DISCORD_TOKEN,
      );
      for (const [guildId, guild] of this.client.guilds.cache) {
        try {
          await rest.put(
            Routes.applicationCommands(process.env.DISCORD_CLIENT_ID, guildId),
            {
              body: commands,
            },
          );
        } catch (error) {
          console.error(error);
        }
      }
    });

    this.client.on('interactionCreate', async (interaction) => {
      if (!interaction.isCommand()) return;

      const { commandName, options } = interaction;

      if (commandName === 'huntstart') {
        const start = options.getInteger('start');
        const currency = options.getString('currency') as Currency;

        try {
          await this.bonusesService.startHunt(start, currency);
          await interaction.reply(
            `Started a new hunt with starting amount ${start} in ${currency}!`,
          );
        } catch (error) {
          await interaction.reply({ content: error.message, ephemeral: true });
        }
      } else if (commandName === 'bonus') {
        const slotName = this.fzf.find(options.getString('slotname'))[0].item;

        const slot = mapById.get(nameToId.get(slotName));
        const bet = options.getInteger('bet');
        const currency = options.getString('currency') as Currency;

        try {
          const bonus = await this.bonusesService.addBonus(slot, bet, currency);
          await interaction.reply(
            `Added bonus: ${bonus.slotName} with bet ${bet} in ${currency}.`,
          );
        } catch (error) {
          await interaction.reply({ content: error.message, ephemeral: true });
        }
      } else if (commandName === 'huntend') {
        try {
          await this.bonusesService.endHunt();
          await interaction.reply('The current hunt has been ended.');
        } catch (error) {
          await interaction.reply({ content: error.message, ephemeral: true });
        }
      } else if (commandName === 'payout') {
        const slotName = options.getString('slotname');
        const win = options.getInteger('win');
        const currency = options.getString('currency') as Currency;

        try {
          const bonus = await this.bonusesService.updatePayout(
            slotName,
            win,
            currency,
          );
          await interaction.reply(`Updated payout for ${bonus.slotName}.`);
        } catch (error) {
          await interaction.reply({ content: error.message, ephemeral: true });
        }
      }
    });

    this.client.login(process.env.DISCORD_TOKEN);
  }
}
