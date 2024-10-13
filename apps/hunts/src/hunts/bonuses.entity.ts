import { Currency, Slot } from 'stream-types';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Bonus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bet: number;

  @Column()
  slotName: string;

  @Column('json')
  slot: Slot;

  @Column({ default: null, nullable: true })
  payout: number | null;

  @Column({ default: false })
  isSpecial: boolean;

  @Column({
    type: 'enum',
    enum: Currency,
  })
  currency: Currency;

  @Column()
  huntId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
