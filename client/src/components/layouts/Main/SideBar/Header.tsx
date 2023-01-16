import { User } from 'react-feather';

import { useUser } from '../../../../contexts/user-context/hook';
import { Avatar } from '../../../modules/Avatar';

export function Header() {
	const { userState } = useUser();

	return (
		<header className="w-full rounded-lg flex items-center gap-4">
			<div className="min-w-[4rem] min-h-[4rem] max-w-[4rem] max-h-[4rem]">
				{userState.data?.avatarConfig && <Avatar userConfig={userState.data?.avatarConfig} />}
			</div>
			<span className="text-md text-gray-700">
				Hi, <strong>{userState.data?.name || '...'}</strong>
			</span>
		</header>
	);
}
