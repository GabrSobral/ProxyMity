import { X } from '@phosphor-icons/react';

import { UserImage } from '@/@design-system/UserImage';
import { UserApi } from '@/types/user';

interface Props {
	user: UserApi;
	isSelected: boolean;
	removeAccount: () => void;
}

export function SelectedUserItem({ user, isSelected, removeAccount }: Props) {
	return (
		<li className="w-full  relative py-2 px-3 rounded-xl flex gap-4 hover:opacity-90 group dark:bg-gray-900 bg-white transition-all shadow-md">
			<div
				className={`${
					isSelected ? 'w-full left-0 opacity-100' : 'w-0 left-2/4 opacity-10'
				} absolute h-full bg-gradient-to-r from-[#1C64CE] border-0 to-[#B809A6] transition-all rounded-xl top-0 z-0 duration-[0.3s] mx-auto`}
			/>
			<UserImage src={user?.photoUrl || 'https://github.com/GabrSobral.png'} alt="Alt Text" status={'offline'} />

			<div className={'flex flex-col gap-1 overflow-hidden w-full z-10'}>
				<span
					className={`${
						isSelected ? 'text-white' : 'text-gray-700 dark:text-gray-200'
					} truncate font-medium flex items-center justify-between gap-3 `}
				>
					{user.name}
				</span>

				<span className={`${isSelected ? 'text-white' : 'text-gray-500 dark:text-gray-400'} truncate text-sm`}>
					{user.email}
				</span>
			</div>

			<button
				type="button"
				title="remove account"
				className="absolute top-4 right-4 cursor-pointer z-10"
				onClick={removeAccount}
			>
				<X className="text-gray-700 dark:text-gray-200 transition-colors" size={24} />
			</button>
		</li>
	);
}
