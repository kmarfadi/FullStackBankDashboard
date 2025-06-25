import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsPositive,
  Min,
  ValidateNested,
} from 'class-validator';

export class TransactionDto {
  @IsNumber()
  @Min(1)
  personId: number;

  @IsNumber()
  @IsPositive()
  amount: number;
}

export class ProcessTransactionsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransactionDto)
  transactions: TransactionDto[];
}
