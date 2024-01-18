import '@auth/sveltekit';
import { User } from './user';

declare module '@auth/sveltekit' {
   interface Session {
      accessToken: string | undefined;
      user: User;
   }
}

declare module '@auth/sveltekit/jwt' {
   interface JWT extends ISessionPayload {
      error?: 'RefreshAccessTokenError';
   }
}
