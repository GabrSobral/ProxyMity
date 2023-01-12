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
			data-mdb-ripple="true"
			data-mdb-ripple-color="light"
			className={twMerge(
				clsx(
					'disabled:cursor-not-allowed disabled:brightness-90 min-h-[44px] border-2 border-solid h-fit w-fit whitespace-nowrap px-4 py-[0.375rem] rounded-md flex gap-2 items-center justify-center font-semibold hover:brightness-90 transition-all outline-none focus:outline-purple-500 focus:ring-0',
					{
						'border-purple-500 text-white bg-gradient-to-r from-[#B809A6] border-0 to-[#1C64CE]':
							!isOutlined,
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
