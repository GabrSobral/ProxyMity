import { FastifyReply, FastifyRequest } from 'fastify';

import { ContactRepository } from '@application/repositories/contact-repository';
import { SearchContactByEmail } from '@application/use-cases/search-contact-by-email';

import { ContactViewModel } from '@infra/http/view-model/contact-view-model';

interface IRequest {
  email: string;
}

export class SearchContactByEmailControllerHandler {
  constructor(private contactRepository: ContactRepository) {}

  async handle(request: FastifyRequest, response: FastifyReply) {
    const searchContact = new SearchContactByEmail(this.contactRepository);

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
