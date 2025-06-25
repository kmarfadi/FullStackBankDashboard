import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PersonService } from './person.service';
import { Person } from './person.entity';

@Controller('persons')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get()
  async findAll(): Promise<Person[]> {
    return this.personService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Person> {
    return this.personService.findOne(id);
  }
}
