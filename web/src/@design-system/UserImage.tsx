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

export function UserImage({ status, containerClassName, statusClassName, showPlaceholder, ...rest }: Props) {
	return (
		<div
			style={{
				maxHeight: rest.height,
				maxWidth: rest.width,
				minHeight: rest.height,
				minWidth: rest.width,
			}}
			className={twMerge(`relative`, containerClassName)}
		>
			{showPlaceholder ? (
				<div
					className={twMerge(
						`min-w-[${rest.width || 54}px] min-h-[${rest.height || 54}px] max-w-[${rest.width || 54}px] max-h-[${
							rest.height || 54
						}px] rounded-full z-0 shadow-xl flex items-center justify-center`,
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
						`min-w-[${rest.width || 54}px] min-h-[${rest.height || 54}px] max-w-[${rest.width || 54}px] max-h-[${
							rest.height || 54
						}px] rounded-full z-0 shadow-xl`,
						rest.className
					)}
					{...rest}
				/>
			)}

			<div
				title="Online"
				className={twMerge(
					clsx(
						`absolute bottom-1 right-0 z-10  min-w-[${Number(rest.width || 54) / 3}px] min-h-[${
							Number(rest.height || 54) / 3
						}px] rounded-full border-4 border-gray-800`,
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
