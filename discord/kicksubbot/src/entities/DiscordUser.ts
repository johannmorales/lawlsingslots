import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {Sub} from './Sub';

@Entity()
export abstract class DiscordUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({type: 'text', unique: true})
  userId!: string;

  @Column({type: 'text'})
  name?: string;

  @Column({type: 'text', nullable: true})
  kickUsername?: string | null;

  @Column({type: 'text'})
  uuid!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({type: 'datetime', nullable: true})
  verifiedAt!: Date | null;

  @OneToMany(() => Sub, sub => sub.discordUser)
  subs!: Sub[];
}
