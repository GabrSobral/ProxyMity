import { Contact } from '@application/entities/contact';
import { ContactRepository } from '@application/repositories/contact-repository';
import { Either, left, right } from '@helpers/Either';

interface Request {
  email: string;
}

interface Response {
  contact: Contact | null;
}

export class SearchContact {
  constructor(private contactRepository: ContactRepository) {}

  async execute({ email }: Request): Promise<Either<Error, Response>> {
    const contact = await this.contactRepository.findByEmail(email);

    if (contact.isLeft()) return left(contact.value);

    return right({
      contact: contact.value,
    });
  }
}
