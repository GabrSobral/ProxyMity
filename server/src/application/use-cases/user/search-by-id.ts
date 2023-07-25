import { Injectable } from '@nestjs/common';

import { User } from '@application/entities/user';

import { UserRepository } from '@application/repositories/user-repository';

import { Either, left, right } from '@helpers/Either';

export interface Request {
  id: User['_id'];
}

interface Response {
  user: User | null;
}

@Injectable()
export class SearchByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ id }: Request): Promise<Either<Error, Response>> {
    const user = await this.userRepository.findById(id);

    if (user.isLeft()) return left(user.value);

    return right({
      user: user.value,
    });
  }
}
