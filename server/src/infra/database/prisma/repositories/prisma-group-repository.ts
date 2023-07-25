import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

import { Group } from '@application/entities/group';
import { GroupRepository } from '@application/repositories/group-repository';

import { GroupPrismaMapper } from '../mappers/prisma-group.mapper';

import { Either, right } from '@helpers/Either';

@Injectable()
export class PrismaGroupRepository implements GroupRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(newGroup: Group): Promise<Either<Error, void>> {
    await this.prisma.group.create({
      data: {
        id: newGroup.id,
        name: newGroup.name,
        description: newGroup.description,
        created_at: newGroup.createdAt,
        updated_at: newGroup.updatedAt,
      },
    });

    return right(void 0);
  }

  async findById(groupId: string): Promise<Either<Error, Group | null>> {
    const group = await this.prisma.group.findFirst({ where: { id: groupId } });

    if (group) {
      return right(GroupPrismaMapper.toDomain(group));
    } else {
      return right(null);
    }
  }
}
