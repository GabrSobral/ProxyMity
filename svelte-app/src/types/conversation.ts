export interface Conversation {
	dbId?: number;
	id: string;
	isGroup: boolean;
	disabledAt: Date | null;
	createdAt: Date;
	order?: number;
	groupName: string | null;
	groupDescription: string | null;
	participants: {
		id: string;
		name: string;
		email: string;
		photoUrl: string | null;
		lastOnline: Date | null;
		enteredAt: Date;
		removedAt: Date | null;
		// status: 'online' | 'busy' | 'offline' | 'invisible';
	}[];
}
