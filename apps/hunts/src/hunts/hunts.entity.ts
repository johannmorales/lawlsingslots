import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Currency } from 'stream-types';
import { Bonus } from './bonuses.entity';

@Entity()
export class Hunt {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Bonus, (bonus) => bonus.huntId)
  bonuses: Bonus[];

  @Column({ default: false })
  isActive: boolean;

  @Column()
  start: number; // Money amount at the start of the hunt

  @Column({
    type: 'enum',
    enum: Currency,
  })
  currency: Currency;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
