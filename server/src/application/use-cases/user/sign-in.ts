import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

import { IJsonWebToken } from '@infra/authentication/jwt/json-web-token';

import { UserRepository } from '@application/repositories/user-repository';

import { User } from '@application/entities/user';

import { Either, left, right } from '@helpers/Either';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  access_token: string;
}

@Injectable()
export class SignInUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jsonWebTokenHandler: IJsonWebToken,
  ) {}

  async execute(request: Request): Promise<Either<Error, Response>> {
    const { email, password } = request;

    const result = await this.userRepository.findByEmail(email.toLowerCase());

    if (result.isLeft()) {
      return left(result.value);
    }

    const user = result.value;

    if (!user) {
      return left(new Error('User not exists'));
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
      return left(new Error('Email/Password invalid.'));
    }

    const token = this.jsonWebTokenHandler.sign(
      {
        email: user.email.toLowerCase(),
      },
      60 * 60, // 1 hour
    );

    return right({
      user,
      access_token: token,
    });
  }
}
