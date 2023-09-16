'use client';

import { Text } from '@/@design-system/Text';
import { UserImage } from '@/@design-system/UserImage';
import { useAuth } from '@/contexts/auth-context/hook';
import { Bell, Info, MoonStars, Translate } from '@phosphor-icons/react';

export function SideBar() {
	const { user } = useAuth();

	return (
		<aside className="flex flex-col gap-6 p-2 tracking-wide min-w-[270px] max-w-[270px]">
			<header className="flex flex-col gap-4">
				<Text size="md" className="text-gray-300">
					Account
				</Text>

				<div className="flex gap-4">
					<UserImage src={'https://github.com/GabrSobral.png'} alt="Conversation Photo" status="online" />

					<div className="flex flex-col">
						<Text size="lg" className="font-semibold">
							{user?.name}
						</Text>
						<Text size="sm" className="text-gray-400">
							{user?.email}
						</Text>
					</div>

					<button
						type="button"
						onClick={console.log}
						className="rounded-lg px-3 py-1 dark:bg-gray-700 bg-gray-200 shadow dark:text-white text-gray-700 text-sm hover:brightness-90 transition-all"
					>
						Edit
					</button>
				</div>
			</header>

			<div className="flex flex-col gap-2 tracking-wide">
				<Text size="md" className="text-gray-300">
					General
				</Text>

				<ul className="flex flex-col gap-1">
					<li>
						<button
							type="button"
							className="flex gap-2 items-center rounded-lg px-3 py-2 dark:bg-gray-900 bg-gray-100 w-full dark:hover:bg-gray-800 hover:bg-gray-200 transition-all"
						>
							<MoonStars size={20} className="text-gray-700 dark:text-white transition-all" />
							<Text size="md">Appearance</Text>
						</button>
					</li>
					<li>
						<button
							type="button"
							className="flex gap-2 items-center rounded-lg px-3 py-2 dark:bg-gray-900 bg-gray-100 w-full dark:hover:bg-gray-800 hover:bg-gray-200 transition-all"
						>
							<Bell size={20} className="text-gray-700 dark:text-white transition-all" />
							<Text size="md">Notifications</Text>
						</button>
					</li>
					<li>
						<button
							type="button"
							className="flex gap-2 items-center rounded-lg px-3 py-2 dark:bg-gray-900 bg-gray-100 w-full dark:hover:bg-gray-800 hover:bg-gray-200 transition-all"
						>
							<Translate size={20} className="text-gray-700 dark:text-white transition-all" />
							<Text size="md">Language</Text>
						</button>
					</li>
					<li>
						<button
							type="button"
							className="flex gap-2 items-center rounded-lg px-3 py-2 dark:bg-gray-900 bg-gray-100 w-full dark:hover:bg-gray-800 hover:bg-gray-200 transition-all"
						>
							<Info size={20} className="text-gray-700 dark:text-white transition-all" />
							<Text size="md">About</Text>
						</button>
					</li>
				</ul>
			</div>
		</aside>
	);
}
