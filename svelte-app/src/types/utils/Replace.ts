export type Replace<T, R> = {
	[P in keyof T]: P extends keyof R ? R[P] : T[P];
};
