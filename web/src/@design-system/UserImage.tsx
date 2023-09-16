'use client';

import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import Image, { ImageProps } from 'next/image';

import { User } from '@phosphor-icons/react';

interface Props extends ImageProps {
	status: 'online' | 'offline' | 'busy' | 'invisible';
	containerClassName?: string;
	statusClassName?: string;
	showPlaceholder?: boolean;
}

export function UserImage({ status, containerClassName, statusClassName, showPlaceholder, ...rest }: Props) {
	const imageSize = {
		maxHeight: rest.height || 46,
		maxWidth: rest.width || 46,
		minHeight: rest.height || 46,
		minWidth: rest.width || 46,
	};

	return (
		<div style={imageSize} className={twMerge(`relative`, containerClassName)}>
			{showPlaceholder ? (
				<div
					className={twMerge(`rounded-full z-0 shadow-xl flex items-center justify-center bg-gray-700`, rest.className)}
					style={imageSize}
				>
					<User size={24} className="text-white" />
				</div>
			) : (
				<Image
					width={46}
					height={46}
					className={twMerge(`rounded-full z-0 shadow-xl`, rest.className)}
					style={imageSize}
					{...rest}
					alt="Conversation photo"
				/>
			)}

			<div
				title="Online"
				style={{
					maxHeight: 14,
					maxWidth: 14,
					minHeight: 14,
					minWidth: 14,
				}}
				className={twMerge(
					clsx(`absolute bottom-1 right-0 z-10 rounded-full border-3 border-gray-800`, {
						'bg-green-500': status === 'online',
						'bg-red-400': status === 'busy',
						'bg-gray-800 opacity-70': status === 'offline' || status === 'invisible',
					}),
					statusClassName
				)}
			/>
		</div>
	);
}
