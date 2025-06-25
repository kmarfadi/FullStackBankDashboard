import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Person } from '../person/person.entity';
import { Bank } from '../bank/bank.entity';

export enum TransactionStatus {
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  personId: number;

  @Column()
  bankId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.COMPLETED,
  })
  status: TransactionStatus;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @ManyToOne(() => Person)
  @JoinColumn({ name: 'personId' })
  person: Person;

  @ManyToOne(() => Bank)
  @JoinColumn({ name: 'bankId' })
  bank: Bank;
  summary?: any;
}
