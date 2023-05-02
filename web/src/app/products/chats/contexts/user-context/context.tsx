'use client';

import { getUserAsyncDB } from '@/services/database/use-cases/get-user';
import { useUserStore } from '@/stores/user';

import { createContext, ReactNode, useEffect } from 'react';

interface UserContextProps {}

export const UserContext = createContext({} as UserContextProps);

export function UserProvider({ children }: { children: ReactNode }) {
	const setUser = useUserStore(store => store.actions.setUser);

	useEffect(() => {
		getUserAsyncDB().then(user => {
			// setUser(user);
			setUser({
				id: '1',
				name: 'Gabriel Sobral',
				email: 'gabriel@sobral.com',
				createdAt: new Date(),
				photoUrl: 'https://github.com/GabrSobral.png',
			});
		});
	}, []);

	return <UserContext.Provider value={{}}>{children}</UserContext.Provider>;
}
