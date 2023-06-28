import { User } from '@application/entities/user';

import { UserRepository } from '@application/repositories/user-repository';

import { Either, left, right } from '@helpers/Either';

interface Request {
  email: User['email'];
}

interface Response {
  user: User | null;
}

export class SearchByEmailUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ email }: Request): Promise<Either<Error, Response>> {
    const user = await this.userRepository.findByEmail(email);

    if (user.isLeft()) return left(user.value);

    return right({
      user: user.value,
    });
  }
}
