export interface Contact {
	id: string;
	name: string;
	email: string;

	lastOnline: Date | null;
	registeredAt: Date;
	createdAt: Date;
}
