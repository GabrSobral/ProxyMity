import { create } from 'zustand';
import { Draft, Immutable, produce } from 'immer';

export type IAuthStore = Immutable<{
	signIn: {
		states: {
			email: string;
			password: string;
		};
		actions: {
			setEmailValue: (value: string) => void;
			setPasswordValue: (value: string) => void;
		};
	};
	signUp: {
		states: {
			name: string;
			email: string;
			password: string;
		};
		actions: {
			setNameValue: (value: string) => void;
			setEmailValue: (value: string) => void;
			setPasswordValue: (value: string) => void;
		};
	};
}>;

export const useAuthStore = create<IAuthStore>(set => ({
	signIn: {
		states: {
			email: '',
			password: '',
		},
		actions: {
			setEmailValue: (email: string) =>
				set(
					produce((store: Draft<IAuthStore>) => {
						store.signIn.states.email = email;
					})
				),

			setPasswordValue: (password: string) =>
				set(
					produce((store: Draft<IAuthStore>) => {
						store.signIn.states.password = password;
					})
				),
		},
	},

	signUp: {
		states: {
			name: '',
			email: '',
			password: '',
		},
		actions: {
			setNameValue: (name: string) =>
				set(
					produce((store: Draft<IAuthStore>) => {
						store.signUp.states.name = name;
					})
				),

			setEmailValue: (email: string) =>
				set(
					produce((store: Draft<IAuthStore>) => {
						store.signUp.states.email = email;
					})
				),

			setPasswordValue: (password: string) =>
				set(
					produce((store: Draft<IAuthStore>) => {
						store.signUp.states.password = password;
					})
				),
		},
	},
}));
