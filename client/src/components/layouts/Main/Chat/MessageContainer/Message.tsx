import clsx from 'clsx';
import { useState } from 'react';
import { Check, Clock, Send } from 'react-feather';

import { useUser } from '../../../../../contexts/user-context/hook';
import { Message as IMessage } from '../../../../../types/message';

interface MessageProps {
	message: IMessage;
}

export function Message({ message }: MessageProps) {
	const { userState } = useUser();

	let currentStatus: 'wrote' | 'sent' | 'received' = 'wrote';

	if (message.writtenAt && message.sentAt && !message.receivedAt) currentStatus = 'sent';
	else if (message.writtenAt && message.sentAt && message.receivedAt) currentStatus = 'received';

	const [status, setStatus] = useState<'wrote' | 'sent' | 'received'>(currentStatus);

	const isMine = userState.data?.id === message.authorId;
	const formatter = Intl.DateTimeFormat('pt-br', { hour: 'numeric', minute: 'numeric' });

	return (
		<div
			className={clsx('w-fit h-fit p-2 px-4 rounded  flex gap-1 shadow', {
				'ml-auto': isMine,
				'bg-red-100': isMine,
				'bg-white': !isMine,
			})}
		>
			<span className="text-gray-700">{message.content}</span>

			<span className="text-[12px] flex items-center gap-1 text-gray-500 ml-auto bottom-[-9px] right-[-10px] relative">
				{isMine
					? formatter.format(message.writtenAt)
					: message.receivedAt
					? formatter.format(message.receivedAt)
					: null}

				{status === 'wrote' && <Clock size={13} className="text-gray-500" />}
				{status === 'sent' && <Check size={13} className="text-gray-500" />}
				{status === 'received' && <Send size={13} className="text-gray-500" />}
			</span>
		</div>
	);
}
