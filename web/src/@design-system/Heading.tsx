import clsx from 'clsx';
import { Slot } from '@radix-ui/react-slot';
import { HTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
	asChild?: boolean;
	children: ReactNode;
	className?: string;
	size: 'sm' | 'md' | 'lg';
}

export function Heading({ asChild, children, className, size, ...rest }: HeadingProps) {
	const Component = asChild ? Slot : 'h2';

	return (
		<Component
			className={twMerge(
				clsx(
					'text-gray-700 dark:text-white transition-colors tracking-wide',
					{
						'text-md': size === 'sm',
						'text-xl': size === 'md',
						'text-2xl': size === 'lg',
					},
					className
				)
			)}
			{...rest}
		>
			{children}
		</Component>
	);
}
