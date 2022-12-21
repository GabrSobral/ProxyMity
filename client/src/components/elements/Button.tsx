import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Slot } from '@radix-ui/react-slot';
import { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	isOutlined?: boolean;
	asChild?: boolean;
	className?: string;
}

export const Button = ({
	children,
	isOutlined = false,
	asChild = false,
	className,
	...rest
}: ButtonProps) => {
	const Component = asChild ? Slot : 'button';

	return (
		<Component
			className={twMerge(
				clsx(
					'disabled:cursor-not-allowed disabled:brightness-90 min-h-[44px] border-2 border-solid h-fit w-fit whitespace-nowrap px-4 py-[0.375rem] rounded-md flex gap-2 items-center justify-center font-semibold hover:brightness-90 transition-all outline-none focus:outline-red-500 focus:ring-0',
					{
						'border-red-500 text-white bg-red-500': !isOutlined,
						'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-whiteAlpha-900 bg-transparent':
							isOutlined,
					},
					className
				)
			)}
			{...rest}
		>
			{children}
		</Component>
	);
};
