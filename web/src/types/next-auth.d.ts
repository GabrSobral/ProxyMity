import 'next-auth';
import { User } from './user';

declare module 'next-auth' {
	interface Session {
		accessToken: string | undefined;
		user: User;
	}
}

declare module 'next-auth/jwt' {
	interface JWT extends ISessionPayload {
		error?: 'RefreshAccessTokenError';
	}
}
