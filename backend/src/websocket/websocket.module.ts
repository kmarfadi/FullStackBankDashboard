import { Module } from '@nestjs/common';
import { DashboardGateway } from './websocket.gateway';

@Module({
  providers: [DashboardGateway],
  exports: [DashboardGateway],
})
export class WebSocketModule {}
