import { Group } from '@application/entities/group';
import { GroupRepository } from '@application/repositories/group-repository';

import { Either, right } from '@helpers/Either';

export class InMemoryGroupRepository implements GroupRepository {
  public items: Group[] = [];

  async create(newGroup: Group): Promise<Either<Error, void>> {
    this.items.push(newGroup);

    return right(void 0);
  }

  async findById(groupId: string): Promise<Either<Error, Group | null>> {
    const group = this.items.find(item => item.id === groupId);

    return right(group || null);
  }
}
