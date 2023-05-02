import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import Image, { ImageProps } from 'next/image';

import { Contact } from '@/types/contact';
import { User } from '@phosphor-icons/react';

interface Props extends ImageProps {
	status: Contact['status'];
	containerClassName?: string;
	statusClassName?: string;
	showPlaceholder?: boolean;
}

export function UserImage({
	status,
	containerClassName,
	statusClassName,
	showPlaceholder,
	...rest
}: Props) {
	return (
		<div className={twMerge('relative', containerClassName)}>
			{showPlaceholder ? (
				<div
					className={twMerge(
						`min-w-[${rest.width}px] min-h-[${rest.height}px] rounded-full z-0 shadow-xl flex items-center justify-center`,
						rest.className
					)}
				>
					<User size={24} className="text-white" />
				</div>
			) : (
				<Image
					width={54}
					height={54}
					className={twMerge(
						`min-w-[${rest.width}px] min-h-[${rest.height}px] rounded-full z-0 shadow-xl`,
						rest.className
					)}
					{...rest}
				/>
			)}

			<div
				title="Online"
				className={twMerge(
					clsx(
						'absolute bottom-1 right-0 z-10  min-w-[18px] min-h-[18px] rounded-full border-4 border-gray-800',
						{
							'bg-green-500': status === 'online',
							'bg-red-400': status === 'busy',
							'bg-gray-800 opacity-70': status === 'offline' || status === 'invisible',
						}
					),
					statusClassName
				)}
			/>
		</div>
	);
}
