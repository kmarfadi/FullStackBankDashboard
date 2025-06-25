import {
  Controller,
  Post,
  Body,
  Get,
  UsePipes,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ProcessTransactionsDto } from './dto/process-transactions.dto';

@Controller('transactions')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);

  constructor(private readonly transactionService: TransactionService) {}

  @Post('process')
  @UsePipes(new ValidationPipe({ transform: true }))
  async processTransactions(@Body() dto: ProcessTransactionsDto) {
    try {
      return await this.transactionService.processTransactions(dto);
    } catch (error) {
      this.logger.error('Failed to process transactions', error);
      throw error; // Let the global exception filter handle it
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.transactionService.findAll();
    } catch (error) {
      this.logger.error('Failed to fetch transactions', error);
      throw error; // Let the global exception filter handle it
    }
  }
}
