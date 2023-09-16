import { User } from '@application/entities/user';

export interface IUserViewModel {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  lastOnline: Date | null;
  photoUrl: string | null;
}

export class UserViewModel {
  static parse(user: User): IUserViewModel {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      lastOnline: user.lastOnline,
      photoUrl: user.photoUrl,
    };
  }
}
