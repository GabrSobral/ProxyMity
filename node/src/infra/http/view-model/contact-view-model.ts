import { Contact } from '@application/entities/contact';

export class ContactViewModel {
  static parse(contact: Contact) {
    return {
      id: contact.id,
      name: contact.name,
      email: contact.email,
      createdAt: contact.createdAt,
      lastOnline: contact.lastOnline,
    };
  }
}
