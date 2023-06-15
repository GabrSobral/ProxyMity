import { FastifyReply, FastifyRequest } from 'fastify';

import { SignUpContact } from '@application/use-cases/sign-up-user';
import { ContactRepository } from '@application/repositories/contact-repository';

import { IJsonWebToken } from '@infra/authentication/jwt/json-web-token';
import { ContactViewModel } from '@infra/http/view-model/contact-view-model';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

export class SignUpControllerHandler {
  constructor(
    private contactRepository: ContactRepository,
    private jsonWebTokenHandler: IJsonWebToken,
  ) {}

  async handle(request: FastifyRequest, response: FastifyReply) {
    const signUpContact = new SignUpContact(
      this.contactRepository,
      this.jsonWebTokenHandler,
    );

    const { name, email, password } = request.body as IRequest;

    const result = await signUpContact.execute({
      name,
      email,
      password,
    });

    if (result.isLeft())
      return response.status(400).send({
        message: result.value.message,
      });

    const { contact, access_token } = result.value;

    return response.send({
      user: ContactViewModel.parse(contact),
      access_token,
    });
  }
}
