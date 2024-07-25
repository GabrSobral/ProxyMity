export interface User {
   id: string;
   firstName: string;
   lastName: string | null;
   email: string;
   photoUrl: string;
   createdAt: Date;

   status: 'online' | 'busy' | 'offline' | 'invisible';
}

export interface UserApi {
   id: string;
   firstName: string;
   lastName: string | null;
   email: string;
   photoUrl: string;
   createdAt: Date;
}
