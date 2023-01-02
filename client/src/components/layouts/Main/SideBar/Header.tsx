import { User } from 'react-feather';

import { useUser } from '../../../../contexts/user-context/hook';

export function Header() {
	const { userState } = useUser();

	return (
		<header className="w-full px-4 py-2 bg-gray-100 rounded-lg flex items-center gap-4">
			<div className="min-w-[2.5rem] min-h-[2.5rem] max-w-[2.5rem] max-h-[2.5rem] rounded-full bg-gray-50 transition-colors flex items-center justify-center shadow">
				<User size={24} className="text-red-500" />
			</div>
			<span className="text-md text-gray-700">
				Hi, <strong>{userState.data?.name || '...'}</strong>
			</span>
		</header>
	);
}
