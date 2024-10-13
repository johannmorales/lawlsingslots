import {
  Injectable,
  ConflictException,
  NotFoundException,
  Sse,
} from '@nestjs/common';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bonus } from './bonuses.entity';
import { Hunt } from './hunts.entity';
import { Currency, Slot } from 'stream-types';
import { concat, map, of, Subject } from 'rxjs';

@Injectable()
export class HuntsService {
  private clients: Response[] = [];
  private events = new Subject();

  constructor(
    @InjectRepository(Bonus)
    private bonusesRepository: Repository<Bonus>,
    @InjectRepository(Hunt)
    private huntsRepository: Repository<Hunt>,
  ) {}

  async startHunt(start: number, currency: Currency): Promise<Hunt> {
    const activeHunt = await this.huntsRepository.findOne({
      where: { isActive: true },
    });
    if (activeHunt) {
      throw new ConflictException('There is already an active hunt.');
    }

    const hunt = this.huntsRepository.create({
      start,
      currency,
      isActive: true,
    });
    await this.huntsRepository.save(hunt);
    return hunt;
  }

  async addBonus(slot: Slot, bet: number, currency: Currency): Promise<Bonus> {
    const activeHunt = await this.huntsRepository.findOne({
      where: { isActive: true },
    });
    if (!activeHunt) {
      throw new NotFoundException('No active hunts available.');
    }

    const newBonus = this.bonusesRepository.create({
      slotName: slot.name,
      slot: slot,
      bet,
      currency,
      huntId: activeHunt.id,
    });
    await this.bonusesRepository.save(newBonus);
    this.broadcastBonuses();
    return newBonus;
  }

  async endHunt(): Promise<Hunt | null> {
    const activeHunt = await this.huntsRepository.findOne({
      where: { isActive: true },
    });
    if (!activeHunt) {
      throw new NotFoundException('No active hunt to end.');
    }

    activeHunt.isActive = false;
    const updatedHunt = await this.huntsRepository.save(activeHunt);
    return updatedHunt;
  }

  async getEvents() {
    const activeHunt = await this.huntsRepository.findOne({
      where: { isActive: true },
    });
    const bonuses = await this.bonusesRepository.find({
      where: { huntId: activeHunt?.id },
    });

    return concat(
      of({ data: bonuses }),
      this.events.pipe(
        map((data) => ({
          data,
        })),
      ),
    );
  }

  async broadcastBonuses() {
    const activeHunt = await this.huntsRepository.findOne({
      where: { isActive: true },
    });
    const bonuses = await this.bonusesRepository.find({
      where: { huntId: activeHunt?.id },
    });
    this.events.next(bonuses);
  }
}
