import { createContext, Dispatch, ReactNode, useEffect, useReducer } from 'react';
import { getUserAsyncDB } from '../../services/database/use-cases/get-user';

import {
	UserInitialState,
	UserReducer,
	UserReducerActions,
	UserReducerState,
} from './reducers/user-reducer';

interface UserContextProps {
	userState: UserReducerState;
	userDispatch: Dispatch<UserReducerActions>;
}

export const UserContext = createContext({} as UserContextProps);

export function UserProvider({ children }: { children: ReactNode }) {
	const [userState, userDispatch] = useReducer(UserReducer, UserInitialState);

	useEffect(() => {
		getUserAsyncDB().then(user => userDispatch({ type: 'SET_USER', payload: user }));
	}, []);

	return (
		<UserContext.Provider
			value={{
				userState,
				userDispatch,
			}}
		>
			{children}
		</UserContext.Provider>
	);
}
