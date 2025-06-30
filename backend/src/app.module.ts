import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TransactionModule } from './transaction/transaction.module';
import { PersonModule } from './person/person.module';
import { BankModule } from './bank/bank.module';
import { WebSocketModule } from './websocket/websocket.module';
import { SeedService } from './common/database/seeds/seed.service';
import { Person } from './person/person.entity';
import { Bank } from './bank/bank.entity';
import { Transaction } from './transaction/transaction.entity';
import { Controller, Get } from '@nestjs/common';

// Simple AppController for root route (/)
@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Person, Bank, Transaction],
      synchronize: true,
      logging: false,
      autoLoadEntities: true,
    }),
    TransactionModule,
    PersonModule,
    BankModule,
    WebSocketModule,
  ],
  providers: [SeedService],
  controllers: [AppController],
})
export class AppModule {}
