import { User as PrismaUser } from '@prisma/client';

import { User } from '@application/entities/user';

export class PrismaContactMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        lastOnline: raw.lastOnline,
        createdAt: raw.createdAt,
        password: raw.password,
        photoUrl: raw.photoUrl,
      },
      raw.id,
    );
  }

  static toPrisma(contact: User): PrismaUser {
    return {
      id: contact.id,
      name: contact.name,
      email: contact.email,
      lastOnline: contact.lastOnline,
      createdAt: contact.createdAt,
      password: contact.password,
      photoUrl: contact.photoUrl,
    };
  }
}
