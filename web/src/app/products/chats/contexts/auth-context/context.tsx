'use client';

import { getUserAsyncDB } from '@/services/database/use-cases/get-user';
import { useUserStore } from '@/stores/user';

import { createContext, ReactNode, useEffect } from 'react';

export const AuthContext = createContext({});

export function AuthProvider({ children }: { children: ReactNode }) {
	const setUser = useUserStore(store => store.actions.setUser);

	useEffect(() => {
		getUserAsyncDB().then(setUser);
	}, [setUser]);

	return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}
