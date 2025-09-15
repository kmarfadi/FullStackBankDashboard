import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bank } from './bank.entity';
import { SSEService } from '../sse/sse.service';

@Injectable()
export class BankService {
  private readonly logger = new Logger(BankService.name);

  constructor(
    @InjectRepository(Bank)
    private bankRepository: Repository<Bank>,
    private sseService: SSEService,
  ) {}

  async findOne(): Promise<Bank> {
    let bank = await this.bankRepository.findOne({ where: { id: 1 } });

    if (!bank) {
      bank = this.bankRepository.create({
        id: 1,
        name: 'Bank',
        balance: 1000000,
      });
      await this.bankRepository.save(bank);
    }

    return bank;
  }

  async updateBalance(amount: number): Promise<Bank> {
    await this.bankRepository.increment({ id: 1 }, 'balance', amount);
    await this.bankRepository.update({ id: 1 }, { updatedAt: new Date() });
    const updatedBank = await this.findOne();
    
    // Emit SSE event for real-time balance update
    this.sseService.sendBankBalanceUpdate(Number(updatedBank.balance));
    
    return updatedBank;
  }

  async getCurrentBalance(): Promise<number> {
    const bank = await this.findOne();
    return Number(bank.balance);
  }
}
