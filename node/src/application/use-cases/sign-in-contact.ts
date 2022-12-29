import bcrypt from 'bcrypt';

import { Contact } from '@application/entities/contact';
import { ContactRepository } from '@application/repositories/contact-repository';

import { Either, left, right } from '@helpers/Either';
import { IJsonWebToken } from '@infra/authentication/jwt/json-web-token';

interface SignInRequest {
  email: string;
  password: string;
}
interface SignInResponse {
  contact: Contact;
  access_token: string;
}

export class SignInContact {
  constructor(
    private readonly contactRepository: ContactRepository,
    private readonly jsonWebTokenHandler: IJsonWebToken,
  ) {}

  async execute(
    request: SignInRequest,
  ): Promise<Either<Error, SignInResponse>> {
    const { email, password } = request;

    if (!email || !password) return left(new Error('Email/Password invalid.'));

    const result = await this.contactRepository.findByEmail(email);

    if (result.isLeft()) return left(result.value);

    const contact = result.value;

    if (!contact) return left(new Error('User not exists'));

    const isCorrectPassword = await bcrypt.compare(password, contact.password);

    if (!isCorrectPassword) return left(new Error('Email/Password invalid.'));

    const token = this.jsonWebTokenHandler.sign(
      {
        email: contact.email,
      },
      60 * 60, // 1 hour
    );

    return right({
      contact,
      access_token: token,
    });
  }
}
