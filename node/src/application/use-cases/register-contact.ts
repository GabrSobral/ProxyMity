import bcrypt from 'bcrypt';

import { Either, Left, right } from '@helpers/Either';
import { ContactRepository } from '../repositories/contact-repository';
import { IJsonWebToken } from '@infra/authentication/jwt/json-web-token';
import { Contact } from '@application/entities/contact';

interface SignUpContactRequest {
  name: string;
  email: string;
  password: string;
}

export interface UserLoginResponse {
  contact: Contact;
  access_token: string;
}

export class SignUpContact {
  constructor(
    private readonly contactRepository: ContactRepository,
    private readonly jsonWebTokenHandler: IJsonWebToken,
  ) {}

  async execute(
    request: SignUpContactRequest,
  ): Promise<Either<Error, UserLoginResponse>> {
    const { email, name, password } = request;

    const alreadyExists = await this.contactRepository.findByEmail(email);

    if (alreadyExists.isLeft()) return new Left(alreadyExists.value);

    if (alreadyExists.value)
      return new Left(new Error('Email already registered.'));

    if (!name) return new Left(new Error('User name not provided.'));

    if (!password) return new Left(new Error('User password not provided.'));

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newContact = Contact.create({
      name,
      email,
      password: encryptedPassword,
      lastOnline: null,
    });

    await this.contactRepository.create(newContact);

    const token = this.jsonWebTokenHandler.sign(
      {
        email: newContact.email,
      },
      60 * 60, // 1 hour
    );

    return right({
      contact: newContact,
      access_token: token,
    });
  }
}
