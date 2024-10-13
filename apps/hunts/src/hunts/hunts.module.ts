import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hunt } from './hunts.entity';
import { Bonus } from './bonuses.entity';
import { HuntController } from './hunts.controller';
import { HuntsService } from './hunts.service';
import { DiscordService } from 'src/discord/discord.service';

@Module({
  imports: [TypeOrmModule.forFeature([Hunt, Bonus])],
  providers: [HuntsService, DiscordService],
  controllers: [HuntController],
})
export class HuntsModule {}
