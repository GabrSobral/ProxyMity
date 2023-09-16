'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ReactNode, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';

import { LoadingSpinning } from '@/@design-system/LoadingSpinning';
import { useTheme } from '@/contexts/theme-context/hook';
import { Laptop, Moon, Sun } from '@phosphor-icons/react';

export default function AuthenticationLayout({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const isSignInPage = pathname.includes('sign-in');
	const { changeTheme, theme } = useTheme();

	return (
		<main className="flex-1 flex items-center justify-center bg-[url('/sign-background.svg')] bg-no-repeat bg-cover relative">
			<div className="flex gap-4 absolute top-4 left-4">
				<button
					type="button"
					title="Set to Light Theme"
					onClick={() => changeTheme('light')}
					aria-label="Set to Light Theme"
					data-is-active={theme === 'light'}
					className="data-[is-active=true]:ring-purple-500 ring-0 data-[is-active=true]:ring-2 rounded-full p-3 bg-white w-[46px] h-[46px] min-w-[46px] min-h-[46px] transition-all hover:brightness-75 flex items-center justify-center shadow-lg"
				>
					<Sun className="text-gray-700" size={24} weight="fill" />
				</button>

				<button
					type="button"
					title="Set to Dark Theme"
					onClick={() => changeTheme('dark')}
					aria-label="Set to Dark Theme"
					data-is-active={theme === 'dark'}
					className="data-[is-active=true]:ring-purple-500 ring-0 data-[is-active=true]:ring-2 rounded-full p-3 bg-gray-800 w-[46px] h-[46px] min-w-[46px] min-h-[46px] transition-all hover:brightness-75 flex items-center justify-center shadow-lg"
				>
					<Moon className="text-white" size={24} weight="fill" />
				</button>

				<button
					type="button"
					title="Set to System Theme"
					onClick={() => changeTheme('system')}
					aria-label="Set to System Theme"
					data-is-active={theme === 'system'}
					className="data-[is-active=true]:ring-purple-500 ring-0 data-[is-active=true]:ring-2 dark:border-gray-700 rounded-full p-3 bg-transparent w-[46px] h-[46px] min-w-[46px] min-h-[46px] transition-all hover:brightness-75 flex items-center justify-center shadow-lg"
				>
					<Laptop className="text-white transition-colors" size={24} weight="fill" />
				</button>
			</div>

			<div className="p-4 duration-300 rounded-[1rem] ring-1 ring-gray-700 w-96 flex flex-col gap-4 shadow-lg bg-gray-800/40 backdrop-blur-sm transition-all max-h-full">
				<header className="flex items-center justify-center relative h-[80px]">
					<Image src="/Logo.svg" alt="ProxyMity Logo" width={170} height={170} className="absolute -top-[5rem]" />
				</header>

				<div className="flex w-full bg-gray-900 relative rounded-full shadow-inner">
					<div
						data-signin={isSignInPage}
						data-signup={!isSignInPage}
						className="absolute h-[80%] -translate-y-2/4 top-2/4 w-[calc(50%-12px)] rounded-full z-20 gradient transition-all shadow-lg duration-300 data-[signin=true]:left-[6px] data-[signup=true]:left-[calc(50%+6px)]"
					/>

					<Link
						href="/auth/sign-in"
						shallow
						title="Log In Page"
						className="flex items-center flex-1 text-white font-medium text-lg whitespace-nowrap p-3 rounded-[10px] justify-center z-30 tracking-widest"
					>
						Log In
					</Link>

					<Link
						href="/auth/sign-up"
						shallow
						title="Register page"
						className="flex items-center flex-1 text-white font-medium text-lg whitespace-nowrap p-3 rounded-[10px] justify-center z-30 tracking-widest"
					>
						Register
					</Link>
				</div>

				<div className="overflow-hidden p-1 flex items-center justify-center flex-1 flex-col">
					<AnimatePresence mode="wait">
						<Suspense fallback={<LoadingSpinning size={32} color="white" lineSize={3} />}>{children}</Suspense>
					</AnimatePresence>
				</div>
			</div>
		</main>
	);
}
