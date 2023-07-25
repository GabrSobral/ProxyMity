import clsx from 'clsx';
import { Slot } from '@radix-ui/react-slot';
import { HTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export interface TextProps extends HTMLAttributes<HTMLSpanElement> {
	asChild?: boolean;
	children: ReactNode;
	className?: string;
	size: 'sm' | 'md' | 'lg';
	defaultTextColor?: string;
}

export function Text({
	asChild,
	children,
	className,
	size,
	defaultTextColor = 'text-gray-700 dark:text-whiteAlpha-900',
	...rest
}: TextProps) {
	const Component = asChild ? Slot : 'span';

	return (
		<Component
			className={twMerge(
				clsx(
					'transition-colors',
					{
						'text-xs': size === 'sm',
						'text-sm': size === 'md',
						'text-md': size === 'lg',
					},
					defaultTextColor
				),
				className
			)}
			{...rest}
		>
			{children}
		</Component>
	);
}
