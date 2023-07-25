'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { Eye, Gear, SignOut } from '@phosphor-icons/react';

import { useAuth } from '@/contexts/auth-context/hook';
import { ChangeStatusModal } from './ChangeStatusModal';
import { LogoutModal } from './LogoutModal';

export type Status = 'online' | 'busy' | 'invisible';

export function Profile() {
	const { user } = useAuth();

	const [status, setStatus] = useState<Status>('online');

	const [showStatusModal, setShowStatusModal] = useState(false);
	const [showLogoutModal, setShowLogoutModal] = useState(false);

	function selectStatus(selectedStatus: Status) {
		setStatus(selectedStatus);
		setShowStatusModal(false);
	}

	return (
		<div className="flex items-center gap-3">
			<div className="flex flex-col gap-1">
				<span className="text-gray-100 ">Good Morning, {user?.name}</span>
				<span className="text-xs text-gray-300">{user?.email}</span>
			</div>

			<div className="relative">
				<Popover className="relative">
					<Popover.Button>
						<Image
							src="https://github.com/GabrSobral.png"
							alt="My Avatar Photo"
							width={46}
							height={46}
							className="min-w-[46px] min-h-[46px] rounded-full z-0"
						/>
					</Popover.Button>

					<Transition
						enter="transition duration-100 ease-out"
						enterFrom="transform scale-95 opacity-0 translate-y-[0px]"
						enterTo="transform scale-100 opacity-100 translate-y-[16px]"
						leave="transition duration-75 ease-out"
						leaveFrom="transform scale-100 opacity-100 translate-y-[16px]"
						leaveTo="transform scale-95 opacity-0 translate-y-[0px]"
					>
						<Popover.Panel className="min-w-[200px] flex-col flex gap-1 absolute z-10 -top-3 right-0 bg-gray-900/70 p-2 rounded-[1rem] w-fit overflow-hidden shadow-lg backdrop-blur-sm">
							<button
								className="text-white text-sm rounded-[calc(1rem-0.5rem)] cursor-pointer tracking-wider transition-all flex items-center gap-2 hover:bg-purple-500 hover:text-white p-2"
								type="button"
								onClick={() => setShowStatusModal(state => !state)}
							>
								<Eye className="text-white" size={24} weight="light" />
								Change Status
							</button>

							<button
								className="text-white text-sm rounded-[calc(1rem-0.5rem)] cursor-pointer tracking-wider transition-all flex items-center gap-2 hover:bg-purple-500 hover:text-white p-2"
								type="button"
							>
								<Gear className="text-white" size={24} weight="light" />
								Settings
							</button>

							<button
								className="text-red-400 group text-sm rounded-[calc(1rem-0.5rem)] font-medium tracking-wider cursor-pointer transition-all flex items-center gap-2 hover:bg-purple-500 hover:text-white p-2"
								type="button"
								onClick={() => setShowLogoutModal(true)}
							>
								<SignOut className="text-red-400 group-hover:text-white" size={24} />
								Logout
							</button>
						</Popover.Panel>
					</Transition>

					<div
						title={`You are ${status}`}
						className={clsx(
							'absolute bottom-0 right-0 z-10  min-w-[18px] min-h-[18px] rounded-full border-4 border-gray-800 hover:scale-150 transition-all',
							{
								'bg-green-500': status === 'online',
								'bg-red-400': status === 'busy',
								'bg-gray-800 opacity-70': status === 'invisible',
							}
						)}
					/>
				</Popover>

				<ChangeStatusModal
					closeModal={() => setShowStatusModal(false)}
					show={showStatusModal}
					selectStatus={selectStatus}
				/>

				<LogoutModal closeModal={() => setShowLogoutModal(false)} show={showLogoutModal} />
			</div>
		</div>
	);
}
