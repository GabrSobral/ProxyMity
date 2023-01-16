import { AvatarProps } from '@bigheads/core';

export interface Contact {
	id: string;
	name: string;
	email: string;

	lastOnline: Date | null;
	registeredAt: Date | null;
	createdAt: Date;

	avatarConfig: AvatarProps;
}
