import { PrismaClient } from '@prisma/client';

import { User } from '@application/entities/user';
import { UserRepository } from '@application/repositories/user-repository';
import { Either, left, right } from '@helpers/Either';

import { PrismaContactMapper } from '../mappers/prisma-contact.mapper';

export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(user: User): Promise<Either<Error, User>> {
    try {
      const newUser = await this.prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
          lastOnline: user.lastOnline,
          password: user.password,
          photoUrl: user.photoUrl,
        },
      });

      return right(PrismaContactMapper.toDomain(newUser));
    } catch (error) {
      return left(new Error('Error on try to create user on database'));
    }
  }

  async findByEmail(email: string): Promise<Either<Error, User | null>> {
    try {
      const contact = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!contact) return right(null);

      return right(PrismaContactMapper.toDomain(contact));
    } catch (error) {
      return left(new Error('Error on try to get contact with this email on database'));
    }
  }

  async findById(id: string): Promise<Either<Error, User | null>> {
    try {
      const contact = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!contact) return right(null);

      return right(PrismaContactMapper.toDomain(contact));
    } catch (error) {
      return left(new Error('Error on try to get contact with this id on database'));
    }
  }
}
