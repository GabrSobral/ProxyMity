import { Slot } from '@radix-ui/react-slot';
import {
	createContext,
	ForwardedRef,
	HTMLAttributes,
	InputHTMLAttributes,
	LabelHTMLAttributes,
	ReactNode,
	RefObject,
	useContext,
	useId,
} from 'react';
import { twMerge } from 'tailwind-merge';

export interface InputRootProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	className?: string;
}

const inputContext = createContext({} as { inputId: string });

function InputRoot({ children, className, ...rest }: InputRootProps) {
	const inputId = useId();

	return (
		<inputContext.Provider value={{ inputId }}>
			<div className={twMerge('flex flex-col gap-2 w-full', className)} {...rest}>
				{children}
			</div>
		</inputContext.Provider>
	);
}

interface InputLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
	children: ReactNode;
}
function InputLabel({ children, ...rest }: InputLabelProps) {
	const { inputId } = useContext(inputContext);

	return (
		<label className="text-white dark:text-whiteAlpha-900 font-medium" htmlFor={inputId} {...rest}>
			{children}
		</label>
	);
}

function Wrapper({ children, className }: InputRootProps) {
	return <div className={twMerge('relative w-fit', className)}>{children}</div>;
}

interface InputInputProps<T = RefObject<HTMLInputElement> | ForwardedRef<HTMLInputElement>>
	extends InputHTMLAttributes<HTMLInputElement> {
	asChild?: boolean;
	className?: string;
	inputRef?: T;
}
function InputInput({ asChild, className, inputRef, ...rest }: InputInputProps) {
	const { inputId } = useContext(inputContext);

	const Component = asChild ? Slot : 'input';

	return (
		<Component
			id={inputId}
			ref={inputRef || null}
			className={twMerge(
				'outline-none flex hover:ring-1 transition-all ring-gray-700 rounded-[10px] bg-gray-900 text-gray-200 focus:outline-purple-500 focus:ring-0 placeholder:text-gray-400 w-full p-4',
				className
			)}
			{...rest}
		/>
	);
}

export const Input = Object.assign(InputInput, {
	Group: InputRoot,
	Label: InputLabel,
	Wrapper: Wrapper,
});
