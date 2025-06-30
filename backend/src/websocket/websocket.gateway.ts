/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Transaction } from '../transaction/transaction.entity';

export interface WebSocketEvents {
  // Bank balance updates
  'bank-balance-updated': (data: {
    balance: number;
    timestamp: string;
  }) => void;

  // Transaction updates
  'transaction-created': (data: { transaction: any }) => void;
  'transaction-status-updated': (data: {
    transactionId: number;
    status: string;
  }) => void;
  'transactions-processed': (data: { summary: any }) => void;

  // Account updates
  'account-updated': (data: { account: any }) => void;
  'accounts-refreshed': (data: { accounts: any[] }) => void;

  // System events
  'connection-established': (data: { message: string }) => void;
  error: (data: { message: string }) => void;
}

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:5173',
    ],
    credentials: false,
  },
  namespace: '/dashboard',
})
export class DashboardGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server<WebSocketEvents>;

  private readonly logger = new Logger(DashboardGateway.name);
  private connectedClients: Set<string> = new Set();

  afterInit() {
    this.logger.log('🚀 WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.connectedClients.add(client.id);
    this.logger.log(`🔌 Client connected: ${client.id}`);

    // Send welcome message
    client.emit('connection-established', {
      message: 'Connected to Financial Dashboard WebSocket',
    });
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    this.logger.log(`🔌 Client disconnected: ${client.id}`);
  }

  // Subscribe to real-time updates
  @SubscribeMessage('subscribe-to-updates')
  handleSubscribeToUpdates(client: Socket, payload: { channels: string[] }) {
    this.logger.log(
      `📡 Client ${client.id} subscribed to: ${payload.channels.join(', ')}`,
    );

    // Join rooms for specific update channels
    payload.channels.forEach((channel) => {
      client.join(channel);
    });

    return { success: true, message: 'Subscribed to updates' };
  }

  // Unsubscribe from updates
  @SubscribeMessage('unsubscribe-from-updates')
  handleUnsubscribeFromUpdates(
    client: Socket,
    payload: { channels: string[] },
  ) {
    this.logger.log(
      `📡 Client ${client.id} unsubscribed from: ${payload.channels.join(', ')}`,
    );

    payload.channels.forEach((channel) => {
      client.leave(channel);
    });

    return { success: true, message: 'Unsubscribed from updates' };
  }

  // Broadcast methods for different types of updates
  broadcastBankBalanceUpdate(balance: number, timestamp: string) {
    this.server.emit('bank-balance-updated', { balance, timestamp });
    this.logger.log(`💰 Broadcasted bank balance update: $${balance}`);
  }

  broadcastTransactionCreated(transaction: Transaction) {
    this.server.emit('transaction-created', { transaction });
    this.logger.log(`📊 Broadcasted new transaction: ${transaction.id}`);
  }

  broadcastTransactionStatusUpdate(transactionId: number, status: string) {
    this.server.emit('transaction-status-updated', { transactionId, status });
    this.logger.log(
      `🔄 Broadcasted transaction status update: ${transactionId} -> ${status}`,
    );
  }

  broadcastTransactionsProcessed(summary: {
    completed: number;
    total: number;
  }) {
    this.server.emit('transactions-processed', { summary });
    this.logger.log(
      `✅ Broadcasted transactions processed: ${summary.completed}/${summary.total}`,
    );
  }

  broadcastAccountUpdate(account: any) {
    this.server.emit('account-updated', { account });
    this.logger.log(`👤 Broadcasted account update: ${account.name}`);
  }

  broadcastAccountsRefreshed(accounts: any[]) {
    this.server.emit('accounts-refreshed', { accounts });
    this.logger.log(
      `👥 Broadcasted accounts refresh: ${accounts.length} accounts`,
    );
  }

  broadcastError(message: string) {
    this.server.emit('error', { message });
    this.logger.error(`❌ Broadcasted error: ${message}`);
  }

  // Get connected clients count
  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }
}
