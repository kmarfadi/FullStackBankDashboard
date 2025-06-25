import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PersonService } from '../../../person/person.service';
import { BankService } from '../../../bank/bank.service';

@Injectable()
export class SeedService implements OnModuleInit {
  seed() {
    throw new Error('Method not implemented.');
  }
  private readonly logger = new Logger(SeedService.name);
  constructor(
    private personService: PersonService,
    private bankService: BankService,
  ) {}

  async onModuleInit() {
    await this.seedDatabase();
  }

  private async seedDatabase() {
    try {
      this.logger.log('🌱 Starting database seeding...');

      // Seed persons with initial balances
      const existingPersons = await this.personService.findAll();

      if (existingPersons.length === 0) {
        const mockPersons = [
          { name: 'Sultan Johnson', balance: 5000 },
          { name: 'Maxim Smith', balance: 3500 },
          { name: 'Marf Brown', balance: 73400 },
          { name: 'Diana Prince', balance: 4800 },
          { name: 'Mert Norton', balance: 6100 },
          { name: 'Fiona Green', balance: 2900 },
          { name: 'George Wilson', balance: 8500 },
          { name: 'Hannah Davis', balance: 3200 },
        ];

        await this.personService.createMany(mockPersons);
        this.logger.log('✅ Created mock persons with balances');
      }

      // Ensure bank exists
      await this.bankService.findOne();
      this.logger.log('✅ Bank initialized');

      this.logger.log('🎉 Database seeding completed successfully!');
    } catch (error) {
      this.logger.error('❌ Database seeding failed:', error);
    }
  }
}
