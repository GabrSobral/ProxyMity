import { User } from '@application/entities/user';

export class UserViewModel {
  static parse(user: User) {
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
