import { Contact } from '@application/entities/contact';
import { ContactRepository } from '@application/repositories/contact-repository';
import { Either, left, right } from '@helpers/Either';

interface Request {
  id: string;
}

interface Response {
  contact: Contact | null;
}

export class SearchContactById {
  constructor(private contactRepository: ContactRepository) {}

  async execute({ id }: Request): Promise<Either<Error, Response>> {
    const contact = await this.contactRepository.findById(id);

    if (contact.isLeft()) return left(contact.value);

    return right({
      contact: contact.value,
    });
  }
}
