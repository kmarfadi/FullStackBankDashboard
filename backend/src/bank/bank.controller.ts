import {
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { BankService } from './bank.service';
import { Bank } from './bank.entity';

@Controller('bank')
export class BankController {
  private readonly logger = new Logger(BankController.name);

  constructor(private readonly bankService: BankService) {}

  @Get()
  async getBank(): Promise<Bank> {
    try {
      return await this.bankService.findOne();
    } catch (error) {
      this.logger.error('Failed to fetch bank', error);
      throw new InternalServerErrorException('Failed to fetch bank');
    }
  }

  @Get('balance')
  async getBalance(): Promise<{ balance: number; timestamp: Date }> {
    try {
      const bank = await this.bankService.findOne();
      return {
        balance: Number(bank.balance),
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error('Failed to fetch bank balance', error);
      throw new InternalServerErrorException('Failed to fetch bank balance');
    }
  }
}
