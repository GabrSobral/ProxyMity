import { useChat } from '../../../../../contexts/chat-context/hook';
import { Message } from './Message';

export function MessageContainer() {
	const { contactsState, messagesState } = useChat();

	const contactsMessages = messagesState.contacts.find(
		item => item.id === contactsState.selectedContact?.id
	);

	console.log(contactsMessages);

	return (
		<section className="flex flex-1 flex-col gap-1 p-4">
			{contactsMessages?.messages.map(message => (
				<Message
					content={message.content}
					receivedAt={message.receivedAt || new Date()}
					writtenAt={message.writtenAt}
					isMine
				/>
			))}
		</section>
	);
}
