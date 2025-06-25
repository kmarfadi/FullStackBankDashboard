import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from '../transaction.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from '../transaction.entity';
import { PersonService } from '../../person/person.service';
import { BankService } from '../../bank/bank.service';
import { DataSource } from 'typeorm';

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: getRepositoryToken(Transaction), useValue: {} },
        {
          provide: PersonService,
          useValue: {
            findOne: jest
              .fn()
              .mockResolvedValue({ id: 1, name: 'Test', balance: 1000 }),
            updateBalance: jest
              .fn()
              .mockResolvedValue({ id: 1, name: 'Test', balance: 900 }),
            // ...add any other methods you use in TransactionService
          },
        },
        {
          provide: BankService,
          useValue: {
            getCurrentBalance: jest.fn().mockResolvedValue(1000),
            updateBalance: jest
              .fn()
              .mockResolvedValue({ id: 1, balance: 1100 }),
          },
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              manager: {
                create: jest.fn(),
                save: jest.fn(),
                findOne: jest.fn(),
                decrement: jest.fn(),
                increment: jest.fn(),
                update: jest.fn(),
              },
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
            }),
          },
        },
      ],
    }).compile();
    service = module.get<TransactionService>(TransactionService);
  });
  it('findAll should call transactionRepository.find', async () => {
    const transactionRepository = { find: jest.fn().mockResolvedValue([]) };
    (
      service as unknown as {
        transactionRepository: typeof transactionRepository;
      }
    ).transactionRepository = transactionRepository;
    const result = await service.findAll();
    expect(result).toEqual([]);
  });

  it('processTransactions should return summary', async () => {
    (
      service as unknown as { processSingleTransaction: jest.Mock }
    ).processSingleTransaction = jest.fn().mockResolvedValue({});
    const dto = { transactions: [{ personId: 1, amount: 10 }] };
    const result = await service.processTransactions(
      dto as unknown as Parameters<typeof service.processTransactions>[0],
    );
    expect(result).toHaveProperty('summary');
    expect(result.summary.total).toBe(1);
  });
});
