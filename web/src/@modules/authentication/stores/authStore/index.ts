import { create } from 'zustand';
import { Draft, produce } from 'immer';

import { IAuthStore } from './type';

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
