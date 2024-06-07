export interface User {
   id: string;
   name: string;
   email: string;
   photoUrl: string;
   createdAt: Date;

   status: 'online' | 'busy' | 'offline' | 'invisible';
}

export interface UserApi {
   id: string;
   name: string;
   email: string;
   photoUrl: string;
   createdAt: Date;
}
