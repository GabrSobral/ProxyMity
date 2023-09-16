import { User } from '@application/entities/user';

import { UserRepository } from '@application/repositories/user-repository';

import { Either, right } from '@helpers/Either';

export class InMemoryUserRepository implements UserRepository {
  public items: User[];

  constructor() {
    this.items = [];
  }

  async create(user: User): Promise<Either<Error, User>> {
    this.items.push(user);

    return right(user);
  }

  async findByEmail(email: string): Promise<Either<Error, User | null>> {
    const user = this.items.find(item => item.email === email);

    return right(user || null);
  }

  async findById(id: string): Promise<Either<Error, User | null>> {
    const user = this.items.find(item => item.id === id);

    return right(user || null);
  }
}
