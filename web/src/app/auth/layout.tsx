'use client';

import clsx from 'clsx';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ReactNode, Suspense } from 'react';
import { usePathname } from 'next/navigation';

import { LoadingSpinning } from '@/@design-system/LoadingSpinning';

export default function AuthenticationLayout({ children }: { children: ReactNode }) {
	const pathname = usePathname();

	return (
		<div className="flex-1 flex items-center justify-center bg-[url('/sign-background.svg')] bg-no-repeat bg-cover">
			<motion.div className="p-4 rounded-[1rem] ring-1 ring-gray-700 w-96 flex flex-col gap-4 shadow-lg bg-gray-800/40 backdrop-blur-sm transition-all">
				<header className="flex items-center justify-center relative h-[80px]">
					<Image src="/Logo.svg" alt="ProxyMity Logo" width={170} height={170} className="absolute -top-[5rem]" />
				</header>

				<div className="flex w-full bg-gray-900 relative rounded-[10px] shadow-inner">
					<div
						className={clsx(
							'absolute h-[80%] -translate-y-2/4 top-2/4 w-[calc(50%-12px)] rounded-[10px]  z-20 gradient transition-all shadow-lg duration-300',
							{
								'left-[6px]': pathname.includes('sign-in'),
								'left-[calc(50%+6px)]': pathname.includes('sign-up'),
							}
						)}
					/>

					<Link
						href="/auth/sign-in"
						shallow
						className="flex items-center flex-1 text-white font-medium text-lg whitespace-nowrap p-3 rounded-[10px] justify-center"
					>
						<span className="z-30 tracking-widest">Log In</span>
					</Link>

					<Link
						href="/auth/sign-up"
						shallow
						className="flex items-center flex-1 text-white font-medium text-lg whitespace-nowrap p-3 rounded-[10px] justify-center"
					>
						<span className="z-30 tracking-widest">Register</span>
					</Link>
				</div>

				<div className="overflow-hidden p-1">
					<Suspense fallback={<LoadingSpinning size={32} color="white" lineSize={3} />}>{children}</Suspense>
				</div>
			</motion.div>
		</div>
	);
}
