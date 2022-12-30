import { FastifyReply, FastifyRequest } from 'fastify';

import { ContactRepository } from '@application/repositories/contact-repository';
import { SearchContact } from '@application/use-cases/search-contact';

import { ContactViewModel } from '@infra/http/view-model/contact-view-model';

interface IRequest {
  email: string;
  password: string;
}

export class SearchContactControllerHandler {
  constructor(private contactRepository: ContactRepository) {}

  async handle(request: FastifyRequest, response: FastifyReply) {
    const searchContact = new SearchContact(this.contactRepository);

    const { email } = request.params as IRequest;

    const result = await searchContact.execute({
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
