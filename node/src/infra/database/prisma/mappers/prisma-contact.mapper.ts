import { Contact as PrismaContact } from '@prisma/client';

import { Contact } from '@application/entities/contact';

export class PrismaContactMapper {
  static toDomain(raw: PrismaContact): Contact {
    return Contact.create(
      {
        name: raw.name,
        email: raw.email,
        lastOnline: raw.lastOnline,
        createdAt: raw.createdAt,
        password: raw.password,
      },
      raw.id,
    );
  }

  static toPrisma(contact: Contact): PrismaContact {
    return {
      id: contact.id,
      name: contact.name,
      email: contact.email,
      lastOnline: contact.lastOnline,
      createdAt: contact.createdAt,
      password: contact.password,
    };
  }
}
