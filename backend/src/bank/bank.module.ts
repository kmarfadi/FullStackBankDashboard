import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bank } from './bank.entity';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';
import { SSEModule } from '../sse/sse.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bank]),
    SSEModule,
  ],
  controllers: [BankController],
  providers: [BankService],
  exports: [BankService], // Export for use in other modules
})
export class BankModule {}
