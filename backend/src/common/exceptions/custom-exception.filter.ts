import { HttpException, HttpStatus } from '@nestjs/common';

export class InsufficientBalanceException extends HttpException {
  constructor(
    personName: string,
    currentBalance: number,
    requiredAmount: number,
  ) {
    const message = `Insufficient balance. ${personName} has $${currentBalance}, but transaction requires $${requiredAmount}`;
    super(
      {
        error: 'InsufficientBalance',
        message,
        details: {
          personName,
          currentBalance,
          requiredAmount,
          shortfall: requiredAmount - currentBalance,
        },
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class PersonNotFoundException extends HttpException {
  constructor(personId: number) {
    super(
      {
        error: 'PersonNotFound',
        message: `Person with ID ${personId} does not exist`,
        details: { personId },
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class ConcurrentTransactionException extends HttpException {
  constructor(personId: number) {
    super(
      {
        error: 'ConcurrentTransaction',
        message: `Person ${personId} has a transaction in progress. Please try again.`,
        details: { personId },
      },
      HttpStatus.CONFLICT,
    );
  }
}
