'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Moon, Sun } from '@phosphor-icons/react';

import { Switch } from '@design-system/Switch';

import { Routes } from './Routes';
import { Profile } from './Profile';
import { NotificationButton } from './NotificationButton';

export function Header() {
	const [theme, setTheme] = useState('dark');

	return (
		<header className="bg-gray-800 min-h-[70px] border-b border-solid border-gray-900 flex items-center w-full">
			<div className="max-w-[1366px] flex items-center gap-8 px-6 m-auto w-full">
				<Image src="/horizontal-logo.svg" alt="ProxyMity Logo" width={166} height={49} priority />
				<Routes />

				<div className="flex items-center gap-4 ml-auto">
					<Switch
						checked={theme === 'light'}
						onChange={value => setTheme(value ? 'light' : 'dark')}
						checkedComponent={<Moon className="text-gray-500" size={16} />}
						nonCheckedComponent={<Sun className="text-gray-500" size={16} />}
					/>

					<NotificationButton />
				</div>

				<Profile />
			</div>
		</header>
	);
}
