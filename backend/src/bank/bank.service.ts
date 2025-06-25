import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bank } from './bank.entity';

@Injectable()
export class BankService {
  private readonly logger = new Logger(BankService.name);

  constructor(
    @InjectRepository(Bank)
    private bankRepository: Repository<Bank>,
  ) {}

  async findOne(): Promise<Bank> {
    let bank = await this.bankRepository.findOne({ where: { id: 1 } });

    if (!bank) {
      bank = this.bankRepository.create({
        id: 1,
        name: 'Bank',
        balance: 1000000, // Start with 1M balance
      });
      await this.bankRepository.save(bank);
    }

    return bank;
  }

  async updateBalance(amount: number): Promise<Bank> {
    await this.bankRepository.increment({ id: 1 }, 'balance', amount);
    await this.bankRepository.update({ id: 1 }, { updatedAt: new Date() });
    return this.findOne();
  }

  async getCurrentBalance(): Promise<number> {
    const bank = await this.findOne();
    return Number(bank.balance);
  }
}
