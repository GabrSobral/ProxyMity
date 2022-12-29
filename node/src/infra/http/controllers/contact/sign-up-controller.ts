import { Response, Request } from 'express';

import { SignUpContact } from '@application/use-cases/register-contact';
import { PrismaClient } from '@prisma/client';
import { PrismaContactRepository } from '@infra/database/prisma/repositories/prisma-contact-repository';
import { JsonWebToken } from '@infra/authentication/jwt/JsonWebToken';
import { ContactViewModel } from '@infra/http/view-model/contact-view-model';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

export class SignUpControllerHandler {
  async handle(request: Request, response: Response) {
    const prismaClient = new PrismaClient();
    const prismaContactRepository = new PrismaContactRepository(prismaClient);
    const jsonWebTokenHandler = new JsonWebToken();

    const signUpContact = new SignUpContact(
      prismaContactRepository,
      jsonWebTokenHandler,
    );

    const { name, email, password } = request.body as IRequest;

    const result = await signUpContact.execute({
      name,
      email,
      password,
    });

    if (result.isLeft())
      return response.status(400).json({
        message: result.value.message,
      });

    const { contact, access_token } = result.value;

    return response.json({
      user: ContactViewModel.parse(contact),
      access_token,
    });
  }
}
