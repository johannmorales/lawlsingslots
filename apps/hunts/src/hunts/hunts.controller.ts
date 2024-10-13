import { Controller, Get, Req, Res, Sse } from '@nestjs/common';
import { HuntsService } from './hunts.service';
import { Request, Response } from 'express';

@Controller('hunts')
export class HuntController {
  constructor(private huntsService: HuntsService) {}

  @Sse('/sse')
  async sse(@Req() req: Request, @Res() res: Response) {
    const o = await this.huntsService.getEvents();

    return o;
  }

  @Get('/')
  async get() {
    await this.huntsService.broadcastBonuses();
    return { ok: true };
  }
}
