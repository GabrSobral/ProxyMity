import { Either } from '@helpers/Either';
import { User } from '@application/entities/user';

export interface UserRepository {
  create(contact: User): Promise<Either<Error, User>>;
  findByEmail(email: string): Promise<Either<Error, User | null>>;
  findById(id: string): Promise<Either<Error, User | null>>;
}
