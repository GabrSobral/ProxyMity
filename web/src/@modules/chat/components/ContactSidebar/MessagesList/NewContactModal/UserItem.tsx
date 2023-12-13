import { UserImage } from '@/@design-system/UserImage';
import { UserApi } from '@/types/user';
import { Text } from '@/@design-system/Text';

interface Props {
	user: UserApi;
	addAccount: () => void;
}

export function UserItem({ user, addAccount }: Props) {
	return (
		<div
			onClick={addAccount}
			className="w-full  relative py-2 px-3 rounded-xl flex gap-4 cursor-pointer hover:opacity-90 group dark:bg-gray-900 bg-white transition-all shadow-md"
		>
			<div
				className={`absolute h-full bg-gradient-to-r from-[#1C64CE] border-0 to-[#B809A6] transition-all rounded-xl top-0 z-0 duration-[0.3s] mx-auto`}
			/>
			<UserImage src={user?.photoUrl || 'https://github.com/GabrSobral.png'} alt="Alt Text" status={'offline'} />

			<div className={'flex flex-col gap-1 overflow-hidden w-full z-10'}>
				<Text size="lg" className={`truncate font-medium flex items-center justify-between gap-3 `}>
					{user.name}
				</Text>
			</div>
		</div>
	);
}
