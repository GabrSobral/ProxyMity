import { Either } from '@helpers/Either';
import { Contact } from '@application/entities/contact';

export interface ContactRepository {
  create(contact: Contact): Promise<Either<Error, Contact>>;
  findByEmail(email: string): Promise<Either<Error, Contact | null>>;
  findById(id: string): Promise<Either<Error, Contact | null>>;
}
