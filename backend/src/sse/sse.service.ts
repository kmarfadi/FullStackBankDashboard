import { Injectable, Logger } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { MessageEvent } from '@nestjs/common';
import { SSEMessage, BankBalanceSSEData, TransactionSSEData, AccountSSEData } from './sse.types';

@Injectable()
export class SSEService {
  private readonly logger = new Logger(SSEService.name);
  private readonly eventSubject = new Subject<MessageEvent>();

  getEventStream(): Observable<MessageEvent> {
    return this.eventSubject.asObservable();
  }


  private sendEvent(type: SSEMessage['type'], data: any): void {
    this.logger.log(`Sending ${type} event`);
    
    const message: SSEMessage = {
      type,
      data,
      timestamp: new Date().toISOString(),
    };

    const event: MessageEvent = {
      data: JSON.stringify(message),
    };

    this.eventSubject.next(event);
  }

  sendBankBalanceUpdate(balance: number): void {
    this.logger.log(`Sending bank balance update: ${balance}`);
    const data: BankBalanceSSEData = { 
      balance, 
      timestamp: new Date().toISOString() 
    };
    this.sendEvent('bank_balance', data);
  }

  sendTransactionUpdate(transaction: TransactionSSEData): void {
    this.sendEvent('transaction', transaction);
  }

  sendAccountUpdate(account: AccountSSEData): void {
    this.sendEvent('account_update', account);
  }
}