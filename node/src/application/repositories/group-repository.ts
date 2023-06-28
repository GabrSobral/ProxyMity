import { Group } from '@application/entities/group';
import { Either } from '@helpers/Either';

export interface GroupRepository {
  create(newGroup: Group): Promise<Either<Error, void>>;
  findById(groupId: Group['_id']): Promise<Either<Error, Group | null>>;
}
