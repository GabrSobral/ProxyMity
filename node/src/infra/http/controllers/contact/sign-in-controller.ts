import { FastifyReply, FastifyRequest } from 'fastify';

import { SignInContact } from '@application/use-cases/sign-in-contact';
import { ContactRepository } from '@application/repositories/contact-repository';

import { IJsonWebToken } from '@infra/authentication/jwt/json-web-token';
import { ContactViewModel } from '@infra/http/view-model/contact-view-model';

interface IRequest {
  email: string;
  password: string;
}

export class SignInControllerHandler {
  constructor(
    private jsonWebTokenHandler: IJsonWebToken,
    private contactRepository: ContactRepository,
  ) {}

  async handle(request: FastifyRequest, response: FastifyReply) {
    const signInContact = new SignInContact(
      this.contactRepository,
      this.jsonWebTokenHandler,
    );

    const { email, password } = request.body as IRequest;

    const result = await signInContact.execute({
      email,
      password,
    });

    if (result.isLeft())
      return response.status(400).send({
        message: result.value.message,
      });

    const { contact, access_token } = result.value;

    return response.send({
      data: ContactViewModel.parse(contact),
      access_token,
    });
  }
}
