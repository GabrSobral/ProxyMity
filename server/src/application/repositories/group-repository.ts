import { Injectable } from '@nestjs/common';

import { Group } from '@application/entities/group';

import { Either } from '@helpers/Either';

@Injectable()
export abstract class GroupRepository {
  abstract create(newGroup: Group): Promise<Either<Error, void>>;
  abstract findById(groupId: Group['_id']): Promise<Either<Error, Group | null>>;
}
