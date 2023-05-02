'use client';

import clsx from 'clsx';
import Link from 'next/link';
import Image from 'next/image';

import { usePathname } from 'next/navigation';
import { Bell, ChatCenteredText, Gear, Moon, Sun } from '@phosphor-icons/react';

import { Switch } from '@design-system/Switch';
import { useState } from 'react';
import { NotificationButton } from './NotificationButton';
import { Routes } from './Routes';
import { Profile } from './Profile';

export function Header() {
	const [theme, setTheme] = useState('dark');

	return (
		<header className="bg-gray-800  h-[80px] border-b border-solid border-gray-900">
			<div className="max-w-[1366px] flex items-center gap-8 px-6 m-auto">
				<Image src="/horizontal-logo.svg" alt="ProxyMity Logo" width={166} height={49} />
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
