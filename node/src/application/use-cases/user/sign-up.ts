import bcrypt from 'bcrypt';

import { User } from '@application/entities/user';

import { IJsonWebToken } from '@infra/authentication/jwt/json-web-token';

import { UserRepository } from '@application/repositories/user-repository';

import { Either, left, right } from '@helpers/Either';

interface Request {
  name: string;
  email: string;
  password: string;
}

interface Response {
  user: User;
  access_token: string;
}

export class SignUpUseCase {
  constructor(private readonly userRepository: UserRepository, private readonly jsonWebTokenHandler: IJsonWebToken) {}

  async execute(request: Request): Promise<Either<Error, Response>> {
    const { email, name, password } = request;

    const alreadyExists = await this.userRepository.findByEmail(email);

    if (alreadyExists.isLeft()) return left(alreadyExists.value);
    if (alreadyExists.value) return left(new Error('Email already registered.'));
    if (!name) return left(new Error('User name not provided.'));
    if (!password) return left(new Error('User password not provided.'));

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = User.create({
      name,
      email: email.toLowerCase(),
      password: encryptedPassword,
      lastOnline: null,
      photoUrl: null,
    });

    await this.userRepository.create(newUser);

    const token = this.jsonWebTokenHandler.sign(
      {
        email: newUser.email,
      },
      60 * 60, // 1 hour
    );

    return right({
      user: newUser,
      access_token: token,
    });
  }
}
