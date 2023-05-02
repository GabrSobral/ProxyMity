import { create } from 'zustand';

import { User } from '@/types/user';
import { Draft, Immutable, produce } from 'immer';

export type IUserState = Immutable<{
	data: User | null;
}>;

interface IUserStore {
	state: IUserState;
	actions: {
		setUser: (data: User) => void;
	};
}

export const useUserStore = create<IUserStore>(set => ({
	state: {
		data: null,
	},
	actions: {
		setUser: (data: User) =>
			set(
				produce((store: Draft<IUserStore>) => {
					store.state.data = data;
				})
			),
	},
}));
