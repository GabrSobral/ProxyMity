import { User } from '../../../types/user';

export type UserReducerActions = {
	type: 'SET_USER';
	payload: User;
};

export type UserReducerState = {
	data: User | null;
};

export const UserInitialState: UserReducerState = {
	data: null,
};

export function UserReducer(state: UserReducerState, action: UserReducerActions): UserReducerState {
	switch (action.type) {
		case 'SET_USER':
			return { data: action.payload };

		default:
			return { ...state };
	}
}
