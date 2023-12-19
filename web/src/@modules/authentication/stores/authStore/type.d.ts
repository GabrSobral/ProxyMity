import { Immutable } from 'immer';

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
