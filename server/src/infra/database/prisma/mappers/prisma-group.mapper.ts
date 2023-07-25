import { Group } from '@application/entities/group';
import { Group as PrismaGroup } from '@prisma/client';

export class GroupPrismaMapper {
  static toDomain(raw: PrismaGroup): Group {
    return Group.create(
      {
        name: raw.name,
        description: raw.description,
        createdAt: raw.created_at,
        updatedAt: raw.updated_at || undefined,
        conversation: null,
      },
      raw.id,
    );
  }

  static toPrisma(group: Group): PrismaGroup {
    return {
      id: group.id,
      name: group.name,
      description: group.description,
      created_at: group.createdAt,
      updated_at: group.updatedAt,
    };
  }
}
