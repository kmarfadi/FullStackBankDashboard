import { Controller, Sse, MessageEvent } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SSEService } from './sse.service';

@Controller('sse')
export class SSEController {
  constructor(private readonly sseService: SSEService) {}

  @Sse('events')
  sendEvents(): Observable<MessageEvent> {
    return this.sseService.getEventStream();
  }
}