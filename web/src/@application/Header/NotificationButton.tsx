'use client';

import { Bell, BellRinging } from '@phosphor-icons/react';
import { Popover, Transition } from '@headlessui/react';

export function NotificationButton() {
	return (
		<Popover className="relative z-20">
			<Popover.Button
				title="Notifications"
				className="rounded-full p-2 hover:bg-purple-500 hover:text-white group transition-colors"
			>
				<Bell
					className="dark:text-white text-gray-700 transition-colors group-hover:text-white"
					size={28} 
					weight="light"
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
				<Popover.Panel className=" absolute z-10 right -translate-x-3/4 bg-gray-900/70 p-2 rounded-[1rem] w-fit overflow-hidden shadow-lg backdrop-blur-sm">
					<ul className="w-full flex-col flex gap-1">
						<li className="flex w-fit items-center gap-4 hover:bg-purple-500 p-2 rounded-[calc(1rem-0.5rem)] overflow-hidden max-w-[400px] cursor-pointer transition-all">
							<div className="rounded-full p-2 flex items-center justify-center backdrop-brightness-75 shadow min-w-[50px] max-w-[50px] min-h-[50px] max-h-[50px]">
								<BellRinging className="text-white" size={28} weight="light" />
							</div>

							<div className="flex flex-col gap-2 overflow-hidden">
								<span className="text-white whitespace-nowrap truncate text-sm">You have a new message!</span>

								<span className="text-white opacity-75 whitespace-nowrap truncate text-sm">
									Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam optio nihil doloremque molestiae
									consectetur non id corporis voluptas, dolores, accusantium officiis assumenda delectus quae tempora
									porro. Laborum quisquam dignissimos saepe.
								</span>
							</div>
						</li>

						<li className="flex w-fit items-center gap-4 hover:bg-purple-500 p-2 rounded-[calc(1rem-0.5rem)] overflow-hidden max-w-[400px] cursor-pointer transition-all">
							<div className="rounded-full p-2 flex items-center justify-center backdrop-brightness-75 shadow min-w-[50px] max-w-[50px] min-h-[50px] max-h-[50px]">
								<BellRinging className="text-white" size={28} weight="light" />
							</div>

							<div className="flex flex-col gap-2 overflow-hidden">
								<span className="text-white whitespace-nowrap truncate text-sm">You have a new message!</span>

								<span className="text-white opacity-75 whitespace-nowrap truncate text-sm">
									Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam optio nihil doloremque molestiae
									consectetur non id corporis voluptas, dolores, accusantium officiis assumenda delectus quae tempora
									porro. Laborum quisquam dignissimos saepe.
								</span>
							</div>
						</li>
					</ul>
				</Popover.Panel>
			</Transition>
		</Popover>
	);
}
