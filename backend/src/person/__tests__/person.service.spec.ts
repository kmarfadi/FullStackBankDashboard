import { Test, TestingModule } from '@nestjs/testing';
import { PersonService } from '../person.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Person } from '../person.entity';

const mockPersonRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  decrement: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('PersonService', () => {
  let service: PersonService;
  let repo: ReturnType<typeof mockPersonRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonService,
        {
          provide: getRepositoryToken(Person),
          useFactory: mockPersonRepository,
        },
      ],
    }).compile();
    service = module.get<PersonService>(PersonService);
    repo = module.get(getRepositoryToken(Person));
  });

  it('findAll should return array', async () => {
    repo.find.mockResolvedValue([{ id: 1, name: 'Test', balance: 100 }]);
    const result = await service.findAll();
    expect(result).toEqual([{ id: 1, name: 'Test', balance: 100 }]);
  });

  it('findOne should return person', async () => {
    repo.findOne.mockResolvedValue({ id: 1, name: 'Test', balance: 100 });
    const result = await service.findOne(1);
    expect(result).toEqual({ id: 1, name: 'Test', balance: 100 });
  });

  it('create should save and return person', async () => {
    repo.create.mockReturnValue({ name: 'Test', balance: 100 });
    repo.save.mockResolvedValue({ id: 1, name: 'Test', balance: 100 });
    const result = await service.create({ name: 'Test', balance: 100 });
    expect(result).toEqual({ id: 1, name: 'Test', balance: 100 });
  });
});
