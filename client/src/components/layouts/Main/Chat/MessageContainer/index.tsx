import { useChat } from '../../../../../contexts/chat-context/hook';
import { Message } from './Message';

export function MessageContainer() {
	const { contactsState, messagesState } = useChat();

	const contactsMessages = messagesState.contacts.find(
		item => item.id === contactsState.selectedContact?.id
	);

	return (
		<section className="flex flex-1 flex-col gap-1 p-4  overflow-y-auto">
			{contactsMessages?.messages.map(message => (
				<Message key={message.id} message={message} />
			))}
		</section>
	);
}
