import { AvatarProps } from '@bigheads/core';

export interface User {
	id: string;
	name: string;
	email: string;
	avatarConfig: AvatarProps;
	createdAt: Date;
}
