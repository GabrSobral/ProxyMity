import { BigHead, AvatarProps } from '@bigheads/core';

interface Props {
	userConfig: AvatarProps;
}

export function Avatar({ userConfig }: Props) {
	return <BigHead mask {...userConfig} />;
}
