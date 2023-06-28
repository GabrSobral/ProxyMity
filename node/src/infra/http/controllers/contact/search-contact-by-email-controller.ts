import { FastifyReply, FastifyRequest } from 'fastify';

import { UserRepository } from '@application/repositories/user-repository';

import { ContactViewModel } from '@infra/http/view-model/contact-view-model';

interface IRequest {
  email: string;
}

export class SearchUserByEmailControllerHandler {
  constructor(private contactRepository: UserRepository) {}

  async handle(request: FastifyRequest, response: FastifyReply) {
    const searchUser = new SearchUserByEmail(this.contactRepository);

    const { email } = request.params as IRequest;

    const result = await searchUser.execute({
      email,
    });

    if (result.isLeft())
      return response.status(400).send({
        message: result.value.message,
      });

    const { contact } = result.value;

    return response.send({
      data: contact ? ContactViewModel.parse(contact) : null,
    });
  }
}
