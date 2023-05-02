export interface Contact {
	id: string;
	name: string;
	email: string;

	lastOnline: Date | null;
	registeredAt: Date | null;
	createdAt: Date;

	photoUrl: string | null;

	status: 'online' | 'busy' | 'offline' | 'invisible';
}
