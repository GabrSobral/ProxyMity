import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Check, Clock, Eye, Send } from 'react-feather';

import { useUser } from '../../../../../contexts/user-context/hook';
import { changeMessageStatus } from '../../../../../services/database/use-cases/change-message-status';
import { Message as IMessage } from '../../../../../types/message';

const options = {
	wrote: <Clock size={13} className="text-gray-500" />,
	sent: <Check size={13} className="text-gray-500" />,
	received: <Send size={13} className="text-gray-500" />,
	read: <Eye size={13} className="text-gray-500" />,
};

function initialStatus(message: IMessage): keyof typeof options {
	if (message.readAt !== 'none') return 'read';
	if (message.receivedAt !== 'none') return 'received';
	if (message.sentAt !== 'none') return 'sent';

	return 'wrote';
}

export function Message({ message }: { message: IMessage }) {
	const { userState } = useUser();
	const [status, setStatus] = useState<keyof typeof options>(initialStatus(message));

	const isMine = userState.data?.id === message.authorId;
	const formatter = Intl.DateTimeFormat('pt-br', { hour: 'numeric', minute: 'numeric' });

	useEffect(() => {
		if (message.readAt !== 'none' || !isMine) return;

		function handler(event: CustomEventInit<{ status: string; messageId: string }>) {
			const newStatus = event.detail?.status as keyof typeof options;
			const messageId = event.detail?.messageId;

			if (message.id === messageId) {
				setStatus(newStatus);

				if (newStatus === 'sent' || newStatus === 'received')
					changeMessageStatus({ messageId: message.id, status: newStatus });
			}
		}

		addEventListener('@ws.receive_message_status', handler);
		return () => removeEventListener('@ws.receive_message_status', handler);
	}, [message, isMine]);

	return (
		<div
			className={clsx('w-fit h-fit p-2 px-4 rounded  flex gap-1 shadow', {
				'ml-auto': isMine,
				'bg-purple-100': isMine,
				'bg-white': !isMine,
			})}
		>
			<span className="text-gray-700 text-xs">{message.content}</span>

			<span className="text-[12px] flex items-center gap-1 text-gray-500 ml-auto bottom-[-9px] right-[-10px] relative">
				{isMine
					? formatter.format(message.writtenAt)
					: message.receivedAt && message.receivedAt !== 'none'
					? formatter.format(message.receivedAt)
					: null}

				{isMine && options[status]}
			</span>
		</div>
	);
}
