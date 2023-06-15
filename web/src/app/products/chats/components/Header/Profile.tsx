import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';
import { Gear, SignOut } from '@phosphor-icons/react';
import { Popover, Transition } from '@headlessui/react';

import { useUserStore } from '@/stores/user';

type Status = 'online' | 'busy' | 'invisible';

export function Profile() {
	const userData = useUserStore(store => store.state.data);

	const [status, setStatus] = useState<Status>('online');

	return (
		<div className="flex items-center gap-3">
			<div className="flex flex-col gap-1">
				<span className="text-gray-100 ">Good Morning, {userData?.name}</span>
				<span className="text-xs text-gray-300">{userData?.email}</span>
			</div>

			<div className="relative">
				<Popover className="relative">
					<Popover.Button>
						<Image
							src="https://github.com/GabrSobral.png"
							alt="My Avatar Photo"
							width={52}
							height={52}
							className="min-w-[52px] min-h-[52px] rounded-full z-0"
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
							>
								<Gear className="text-white" size={24} weight="light" />
								Settings
							</button>

							<button
								className="text-red-400 group text-sm rounded-[calc(1rem-0.5rem)] font-medium tracking-wider cursor-pointer transition-all flex items-center gap-2 hover:bg-purple-500 hover:text-white p-2"
								type="button"
							>
								<SignOut className="text-red-400 group-hover:text-white" size={24} />
								Logout
							</button>
						</Popover.Panel>
					</Transition>
				</Popover>

				<Popover className="relative">
					<Popover.Button
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

					<Transition
						enter="transition duration-100 ease-out"
						enterFrom="transform scale-95 opacity-0 translate-y-[0px]"
						enterTo="transform scale-100 opacity-100 translate-y-[16px]"
						leave="transition duration-75 ease-out"
						leaveFrom="transform scale-100 opacity-100 translate-y-[16px]"
						leaveTo="transform scale-95 opacity-0 translate-y-[0px]"
					>
						<Popover.Panel className="absolute z-10 -top-3 -translate-x-2/4 bg-gray-900/60 p-4 rounded-[1rem] w-fit overflow-hidden shadow-lg backdrop-blur-sm ">
							<ul className="w-full flex-col flex gap-1">
								<li className="text-white text-sm hover:brightness-75 rounded-[calc(1rem-0.5rem)] cursor-pointer transition-all">
									<button
										type="button"
										onClick={() => setStatus('online')}
										className="flex items-center gap-2"
									>
										<div className="bg-green-500 min-w-[14px] min-h-[14px] max-w-[14px] max-h-[14px]  rounded-full" />
										Online
									</button>
								</li>

								<li className="text-white text-sm hover:brightness-75 rounded-[calc(1rem-0.5rem)] cursor-pointer transition-all">
									<button
										type="button"
										onClick={() => setStatus('busy')}
										className="flex items-center gap-2"
									>
										<div className="bg-red-400 min-w-[14px] min-h-[14px] max-w-[14px] max-h-[14px]  rounded-full" />
										Busy
									</button>
								</li>

								<li className="text-white text-sm hover:brightness-75 rounded-[calc(1rem-0.5rem)] cursor-pointer transition-all">
									<button
										type="button"
										onClick={() => setStatus('invisible')}
										className="flex items-center gap-2"
									>
										<div className="brightness-50 bg-gray-800 min-w-[14px] min-h-[14px] max-w-[14px] max-h-[14px]  rounded-full" />
										Invisible
									</button>
								</li>
							</ul>
						</Popover.Panel>
					</Transition>
				</Popover>
			</div>
		</div>
	);
}
