import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

import { User } from '@application/entities/user';
import { UserRepository } from '@application/repositories/user-repository';

import { PrismaUserMapper } from '../mappers/prisma-user.mapper';

import { Either, left, right } from '@helpers/Either';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

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

      return right(PrismaUserMapper.toDomain(newUser));
    } catch (error) {
      return left(new Error('Error on try to create user on database'));
    }
  }

  async findByEmail(email: string): Promise<Either<Error, User | null>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) return right(null);

      return right(PrismaUserMapper.toDomain(user));
    } catch (error) {
      return left(new Error('Error on try to get user with this email on database'));
    }
  }

  async findById(id: string): Promise<Either<Error, User | null>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) return right(null);

      return right(PrismaUserMapper.toDomain(user));
    } catch (error) {
      return left(new Error('Error on try to get user with this id on database'));
    }
  }
}
