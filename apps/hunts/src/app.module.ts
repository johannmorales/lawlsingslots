import { Module } from '@nestjs/common';
import { HuntsModule } from './hunts/hunts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hunt } from './hunts/hunts.entity';
import { Bonus } from './hunts/bonuses.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HuntsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: 'lawlsingslots',
      username: 'root',
      password: 'postgres',
      synchronize: true,
      entities: [Hunt, Bonus],
    }),
    TypeOrmModule.forFeature([Hunt, Bonus]),
  ],
  providers: [],
})
export class AppModule {}
