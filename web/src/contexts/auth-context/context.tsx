'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { createContext, ReactNode, useEffect, useRef } from 'react';

import { User } from '@/types/user';

interface AuthContextProps {
	user: User | null;
	accessToken: string | null;
}

export const AuthContext = createContext({} as AuthContextProps);

function AuthProvider({ children }: { children: ReactNode }) {
	const { data } = useSession();
	const accessToken = useRef(null);

	useEffect(() => {
		if (data) {
			const session = data as any as { user: User; accessToken: string };
			accessToken.current = session.accessToken as any;
		}
	}, [data]);

	return (
		<AuthContext.Provider
			value={{
				accessToken: accessToken.current,
				user: data ? (data?.user as User) : null,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function AuthWrapperProvider({ children }: { children: ReactNode }) {
	return (
		<SessionProvider>
			<AuthProvider>{children}</AuthProvider>
		</SessionProvider>
	);
}
