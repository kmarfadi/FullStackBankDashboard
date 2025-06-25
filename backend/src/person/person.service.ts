import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from './person.entity';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private personRepository: Repository<Person>,
  ) {}

  async findOne(id: number): Promise<Person> {
    const person = await this.personRepository.findOne({ where: { id } });
    if (!person) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }
    return person;
  }

  async findAll(): Promise<Person[]> {
    return this.personRepository.find({
      order: { name: 'ASC' },
    });
  }

  async updateBalance(id: number, amount: number): Promise<Person> {
    await this.personRepository.decrement({ id }, 'balance', amount);
    return this.findOne(id);
  }

  async createMany(persons: Partial<Person>[]): Promise<Person[]> {
    const entities = this.personRepository.create(persons);
    return this.personRepository.save(entities);
  }

  async create(personData: Partial<Person>): Promise<Person> {
    const person = this.personRepository.create(personData);
    return this.personRepository.save(person);
  }
}
