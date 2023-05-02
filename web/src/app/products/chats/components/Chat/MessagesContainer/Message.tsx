import clsx from 'clsx';
import Image from 'next/image';
import { Fragment } from 'react';
import { motion } from 'framer-motion';

import { Message } from '@/types/message';
import { useUserStore } from '@/stores/user';

interface Props {
	previousIsFromUser?: boolean;
	message: Message;
}

export function Message({ previousIsFromUser = false, message }: Props) {
	const userData = useUserStore(store => store.state.data);

	const isMine = message.authorId === userData?.id;

	return (
		<motion.li
			initial={{ opacity: 0, x: 10 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 10 }}
			className={clsx('flex flex-col gap-1 max-w-[40rem]', {
				'ml-auto': isMine,
			})}
		>
			<div
				className={clsx(
					'flex items-center gap-3 sticky bg-gray-900 p-1 px-2 rounded-full w-fit -top-3',
					{
						'ml-auto': isMine,
					}
				)}
			>
				{!isMine && !previousIsFromUser && (
					<Fragment>
						<Image
							src="https://github.com/diego3g.png"
							alt="User Photo"
							width={35}
							height={35}
							className="min-w-[35px] min-h-[35px] rounded-full z-0 shadow-xl"
						/>
						<span className="text-gray-200 text-sm">Diego</span>
					</Fragment>
				)}

				<span className="text-gray-300 text-xs ml-2 flex items-center gap-2">
					{isMine && (
						<div
							className="flex items-center gap-1 p-[2px] rounded-full bg-purple-500"
							title="Viewed"
						>
							<div
								className={clsx('w-[6px] h-[6px] rounded-full ', {
									'bg-white': true,
									'bg-gray-900 brightness-50': false,
								})}
							/>
							<div
								className={clsx('w-[6px] h-[6px] rounded-full ', {
									'bg-white': true,
									'bg-gray-900 brightness-50': false,
								})}
							/>
						</div>
					)}
					23:52
				</span>
			</div>

			<div
				className={clsx('w-fit rounded-[12px] p-3 text-white font-light text-sm shadow', {
					'bg-gray-950 rounded-tl-none mr-auto': !isMine,
					'bg-purple-500 rounded-tr-none ml-auto': isMine,
				})}
			>
				<p>{message.content}</p>
			</div>
		</motion.li>
	);
}
