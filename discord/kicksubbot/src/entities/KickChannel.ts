import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Sub} from './Sub';

@Entity()
export abstract class KickChannel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({type: 'text', unique: true})
  channel!: string;

  @Column({type: 'text'})
  roleId!: string;

  @OneToMany(() => Sub, sub => sub.kickChannel)
  subs!: Sub[];
}
