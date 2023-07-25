import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChatCenteredText } from '@phosphor-icons/react';

export function Routes() {
	const pathname = usePathname();

	const pages = [
		{
			title: 'Chats',
			path: '/products/chats',
			icon: <ChatCenteredText size={28} weight="fill" />,
		},
	];

	return (
		<nav className="h-full flex items-center gap-4 min-h-[59px] max-h-[59px]">
			{pages.map(page => (
				<Link
					href="/"
					className={clsx(
						'text-md font-medium tracking-wider hover:underline min-h-[59px] max-h-[59px] flex items-center relative pr-2',
						{
							'text-purple-300': page.path === pathname,
							'text-gray-200': page.path !== pathname,
						}
					)}
					key={page.path}
				>
					<span className="flex items-center gap-2 h-full">
						{page.icon}
						{page.title}
					</span>

					<div
						className={clsx('absolute h-1 rounded bg bg-purple-300 bottom-0 m-auto transition-all', {
							'w-0': page.path !== pathname,
							'w-full': page.path === pathname,
						})}
					/>
				</Link>
			))}
		</nav>
	);
}
