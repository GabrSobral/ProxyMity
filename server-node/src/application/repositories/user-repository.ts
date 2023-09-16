import { Injectable } from '@nestjs/common';

import { User } from '@application/entities/user';

import { Either } from '@helpers/Either';

@Injectable()
export abstract class UserRepository {
  abstract create(contact: User): Promise<Either<Error, User>>;
  abstract findByEmail(email: string): Promise<Either<Error, User | null>>;
  abstract findById(id: string): Promise<Either<Error, User | null>>;
}
