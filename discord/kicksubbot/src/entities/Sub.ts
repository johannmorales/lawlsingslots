import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {DiscordUser} from './DiscordUser';
import {KickChannel} from './KickChannel';

@Index('sub-unique', ['kickChannel', 'discordUser'], {unique: true})
@Entity()
export abstract class Sub {
  @PrimaryGeneratedColumn()
  id!: number;

  @UpdateDateColumn()
  lastUpdatedAt!: Date;

  @ManyToOne(() => KickChannel, kickChannel => kickChannel.subs, {
    nullable: false,
    cascade: ['insert', 'remove'],
  })
  @JoinColumn({name: 'kickChannel_id'})
  kickChannel!: KickChannel;

  @ManyToOne(() => DiscordUser, discordUser => discordUser.subs, {
    nullable: false,
    cascade: ['insert', 'remove'],
  })
  @JoinColumn({name: 'discordUser_id'})
  discordUser!: DiscordUser;
}
