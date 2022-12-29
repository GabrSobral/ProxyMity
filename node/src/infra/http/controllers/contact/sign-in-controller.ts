import { Response, Request } from 'express';

import { SignInContact } from '@application/use-cases/sign-in-contact';
import { PrismaClient } from '@prisma/client';
import { PrismaContactRepository } from '@infra/database/prisma/repositories/prisma-contact-repository';
import { JsonWebToken } from '@infra/authentication/jwt/JsonWebToken';
import { ContactViewModel } from '@infra/http/view-model/contact-view-model';

interface IRequest {
  email: string;
  password: string;
}

export class SignInControllerHandler {
  async handle(request: Request, response: Response) {
    const prismaClient = new PrismaClient();
    const prismaContactRepository = new PrismaContactRepository(prismaClient);
    const jsonWebTokenHandler = new JsonWebToken();

    const signInContact = new SignInContact(
      prismaContactRepository,
      jsonWebTokenHandler,
    );

    const { email, password } = request.body as IRequest;

    const result = await signInContact.execute({
      email,
      password,
    });

    if (result.isLeft())
      return response.status(400).json({
        message: result.value.message,
      });

    const { contact, access_token } = result.value;

    return response.json({
      data: ContactViewModel.parse(contact),
      access_token,
    });
  }
}
