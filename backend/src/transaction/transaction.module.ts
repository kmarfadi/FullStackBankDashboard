import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PersonModule } from '../person/person.module';
import { BankModule } from '../bank/bank.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    PersonModule, // Import to use PersonService
    BankModule, // Import to use BankService
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
