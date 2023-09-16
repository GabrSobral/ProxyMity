import Image from 'next/image';

import { Routes } from './Routes';
import { Profile } from './Profile';
import { NotificationButton } from './NotificationButton';

export function Header() {
	return (
		<header className="dark:bg-gray-800 bg-gray-100 min-h-[70px] border-b border-solid dark:border-gray-900 border-gray-200 flex items-center w-full transition-colors">
			<div className="max-w-[1980px]	 flex items-center gap-8 px-6 m-auto w-full">
				<Image src="/horizontal-logo.svg" alt="ProxyMity Logo" width={166} height={49} priority />
				<Routes />

				<div className="flex items-center gap-4 ml-auto">
					<NotificationButton />
				</div>

				<Profile />
			</div>
		</header>
	);
}
