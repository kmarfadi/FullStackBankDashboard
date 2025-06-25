import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './person.entity';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Person])],
  controllers: [PersonController],
  providers: [PersonService],
  exports: [PersonService], // Export for use in other modules
})
export class PersonModule {}
