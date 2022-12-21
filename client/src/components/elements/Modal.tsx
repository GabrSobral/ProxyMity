import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { Fragment, ReactNode } from 'react';
import { X } from 'react-feather';
import { twMerge } from 'tailwind-merge';

export interface ModalProps {
	closeModal: () => void;
	show: boolean;
	children: ReactNode;
	className?: string;
	showCloseButton?: boolean;
}

function ModalGroup({ closeModal, show, children, className, showCloseButton = true }: ModalProps) {
	return (
		<Transition
			appear
			show={show}
			as={Fragment}
		>
			<Dialog
				as="div"
				className="relative z-30"
				onClose={closeModal}
			>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-[2px]" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto flex min-h-full items-center justify-center">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 scale-95"
						enterTo="opacity-100 scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 scale-100"
						leaveTo="opacity-0 scale-95"
					>
						<Dialog.Panel
							className={twMerge(
								clsx(
									'flex flex-col gap-2 m-8 max-w-[90%] overflow-hidden rounded bg-white dark:bg-gray-900 p-6 pt-10 text-left align-middle shadow-xl transition-all',
									className
								)
							)}
						>
							{showCloseButton && (
								<button
									type="button"
									onClick={closeModal}
									title="Fechar"
									className="absolute top-4 right-4"
								>
									<X
										size={24}
										className="dark:text-whiteAlpha-900 text-gray-700"
									/>
								</button>
							)}

							{children}
						</Dialog.Panel>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	);
}

function ModalTitle({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<Dialog.Title
			as="h3"
			className={twMerge(
				clsx('text-lg font-bold leading-6 text-gray-700 dark:text-whiteAlpha-900', className)
			)}
		>
			{children}
		</Dialog.Title>
	);
}

function ModalDescription({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<Dialog.Description
			className={twMerge(clsx('leading-6 text-gray-500 dark:text-gray-400 text-xs', className))}
		>
			{children}
		</Dialog.Description>
	);
}

export const Modal = Object.assign(ModalGroup, {
	Title: ModalTitle,
	Description: ModalDescription,
});