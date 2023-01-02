import { PrismaClient } from '@prisma/client';

import { Contact } from '@application/entities/contact';
import { ContactRepository } from '@application/repositories/contact-repository';
import { Either, left, right } from '@helpers/Either';

import { PrismaContactMapper } from '../mappers/prisma-contact.mapper';

export class PrismaContactRepository implements ContactRepository {
  constructor(private prisma: PrismaClient) {}

  async create(contact: Contact): Promise<Either<Error, Contact>> {
    try {
      const newContact = await this.prisma.contact.create({
        data: {
          id: contact.id,
          email: contact.email,
          name: contact.name,
          createdAt: contact.createdAt,
          lastOnline: contact.lastOnline,
          password: contact.password,
        },
      });

      return right(PrismaContactMapper.toDomain(newContact));
    } catch (error) {
      return left(new Error('Error on try to create user on database'));
    }
  }

  async findByEmail(email: string): Promise<Either<Error, Contact | null>> {
    try {
      const contact = await this.prisma.contact.findUnique({
        where: {
          email,
        },
      });

      if (!contact) return right(null);

      return right(PrismaContactMapper.toDomain(contact));
    } catch (error) {
      return left(
        new Error('Error on try to get contact with this email on database'),
      );
    }
  }

  async findById(id: string): Promise<Either<Error, Contact | null>> {
    try {
      const contact = await this.prisma.contact.findUnique({
        where: {
          id,
        },
      });

      if (!contact) return right(null);

      return right(PrismaContactMapper.toDomain(contact));
    } catch (error) {
      return left(
        new Error('Error on try to get contact with this id on database'),
      );
    }
  }
}
