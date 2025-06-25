import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Transaction, TransactionStatus } from './transaction.entity';
import { PersonService } from '../person/person.service';
import { BankService } from '../bank/bank.service';
import {
  ProcessTransactionsDto,
  TransactionDto,
} from './dto/process-transactions.dto';
import { performance } from 'perf_hooks';

// Move interfaces to module level exports
export interface TransactionResult {
  index: number;
  status: 'completed' | 'failed';
  transaction?: Transaction;
  error?: string;
}

export interface TransactionsSummary {
  total: number;
  completed: number;
  failed: number;
  details: TransactionResult[];
  processingTime?: number; // in milliseconds
}

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private personService: PersonService,
    private bankService: BankService,
    private dataSource: DataSource,
  ) {}

  async processTransaction(
    transactionDto: TransactionDto,
  ): Promise<Transaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Use queryRunner.manager for all database operations
      const person = await this.personService.findOne(transactionDto.personId);
      if (!person) {
        throw new BadRequestException(
          `Person ${transactionDto.personId} not found`,
        );
      }
      if (person.balance < transactionDto.amount) {
        throw new BadRequestException(
          `Insufficient balance for person ${person.name}`,
        );
      }

      // Update balances within the transaction
      await this.personService.updateBalance(person.id, transactionDto.amount);
      const bank = await this.bankService.updateBalance(transactionDto.amount);

      // Create and save transaction using queryRunner.manager
      const transaction = queryRunner.manager.create(Transaction, {
        personId: person.id,
        bankId: bank.id,
        amount: transactionDto.amount,
        status: TransactionStatus.COMPLETED,
        completedAt: new Date(),
      });

      const saved = await queryRunner.manager.save(Transaction, transaction);
      await queryRunner.commitTransaction();

      return saved;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async processTransactions(
    dto: ProcessTransactionsDto,
  ): Promise<{ summary: TransactionsSummary }> {
    const start = performance.now(); // <-- Use performance.now()

    const summary: TransactionsSummary = {
      total: dto.transactions.length,
      completed: 0,
      failed: 0,
      details: [],
    };

    for (const [index, tx] of dto.transactions.entries()) {
      try {
        const result = await this.processTransaction(tx);
        summary.completed++;
        summary.details.push({
          index,
          status: 'completed',
          transaction: result,
        });
      } catch (error) {
        summary.failed++;
        summary.details.push({
          index,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        this.logger.error(`Transaction ${index} failed: ${error}`);
      }
    }

    summary.processingTime = Math.round(performance.now() - start); // <-- More precise

    return { summary };
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find({
      relations: ['person', 'bank'],
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }
}
