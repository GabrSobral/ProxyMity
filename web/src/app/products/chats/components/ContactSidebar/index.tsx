'use client';

import { MagnifyingGlass } from '@phosphor-icons/react';

import { Input } from '@/@design-system/Input';

// import { OnlineNow } from './OnlineNow';
import { MessagesList } from './MessagesList';

export function ContactSidebar() {
	return (
		<aside className="h-full w-[340px] rounded-[1rem] flex flex-col gap-4">
			<Input.Group>
				<Input.Label className="sr-only">Search</Input.Label>

				<Input.Wrapper className="w-full">
					<Input type="search" placeholder="Search..." className="pl-12" />

					<MagnifyingGlass
						className="dark:text-white text-gray-700 transition-colors opacity-60 absolute left-4 top-2/4 -translate-y-2/4 pointer-events-none"
						size={24}
					/>
				</Input.Wrapper>
			</Input.Group>

			{/* <OnlineNow /> */}
			<MessagesList />
		</aside>
	);
}
