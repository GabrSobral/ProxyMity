import { FastifyReply, FastifyRequest } from 'fastify';

import { ContactRepository } from '@application/repositories/contact-repository';
import { SearchContactById } from '@application/use-cases/search-contact-by-id';

import { ContactViewModel } from '@infra/http/view-model/contact-view-model';

interface IRequest {
  id: string;
}

export class SearchContactByIdControllerHandler {
  constructor(private contactRepository: ContactRepository) {}

  async handle(request: FastifyRequest, response: FastifyReply) {
    const searchContact = new SearchContactById(this.contactRepository);

    const { id } = request.params as IRequest;

    const result = await searchContact.execute({
      id,
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
