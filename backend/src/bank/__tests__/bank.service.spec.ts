import { Test, TestingModule } from '@nestjs/testing';
import { BankService } from '../bank.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Bank } from '../bank.entity';
import { DashboardGateway } from '../../websocket/websocket.gateway';

const mockBankRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  increment: jest.fn(),
  update: jest.fn(),
});

const mockDashboardGateway = {
  broadcastBankBalanceUpdate: jest.fn(),
};

describe('BankService', () => {
  let service: BankService;
  let repo: ReturnType<typeof mockBankRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BankService,
        { provide: getRepositoryToken(Bank), useFactory: mockBankRepository },
        { provide: DashboardGateway, useValue: mockDashboardGateway },
      ],
    }).compile();
    service = module.get<BankService>(BankService);
    repo = module.get(getRepositoryToken(Bank));
  });

  it('findOne should return bank or create if not exists', async () => {
    repo.findOne.mockResolvedValueOnce(null);
    repo.create.mockReturnValue({ id: 1, name: 'Marf Bank', balance: 100 });
    repo.save.mockResolvedValue({ id: 1, name: 'Marf Bank', balance: 100 });
    const result = await service.findOne();
    expect(result).toEqual({ id: 1, name: 'Marf Bank', balance: 100 });
  });

  it('getCurrentBalance should return number', async () => {
    repo.findOne.mockResolvedValue({ id: 1, name: 'Marf Bank', balance: 123 });
    const result = await service.getCurrentBalance();
    expect(result).toBe(123);
  });
});
