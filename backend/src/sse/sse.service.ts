import { Injectable, Logger } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { MessageEvent } from '@nestjs/common';

export interface BankBalanceEvent {
  type: 'bank_balance';
  data: {
    balance: number;
    timestamp: string;
  };
}

@Injectable()
export class SSEService {
  private readonly logger = new Logger(SSEService.name);
  private readonly eventSubject = new Subject<MessageEvent>();

 
  getEventStream(): Observable<MessageEvent> {
    return this.eventSubject.asObservable();
  }

  sendBankBalanceUpdate(balance: number): void {
    this.logger.log(`Sending bank balance update: ${balance}`);
    
    const event: MessageEvent = {
      data: JSON.stringify({
        type: 'bank_balance',
        data: {
          balance,
          timestamp: new Date().toISOString(),
        },
      }),
    };

    this.eventSubject.next(event);
  }

  sendEvent(type: string, data: any): void {
    this.logger.log(`Sending ${type} event`);
    
    const event: MessageEvent = {
      data: JSON.stringify({
        type,
        data,
        timestamp: new Date().toISOString(),
      }),
    };

    this.eventSubject.next(event);
  }
}