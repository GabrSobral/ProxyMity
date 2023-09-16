import { Message } from '@/types/message';
import { toText } from '@/utils/binary-parser';

export type Events =
	| { event: 'sent_message'; payload: { message: Message } }
	| { event: 'receive_typing'; payload: { typing: boolean; conversationId: string } }
	| { event: 'receive_message'; payload: { message: Message } }
	| { event: 'receive_read_message'; payload: { conversationId: string } }
	| {
			event: 'receive_message_status';
			payload: {
				messageId: Message['id'];
				status: 'sent' | 'received';
				conversationId: string;
			};
	  };

export type ExtractPayloadType<T extends Event['event'], Event extends Events> = Extract<
	Event,
	{ event: T }
>['payload'];

export async function eventsHandler(message: MessageEvent) {
	const messageParsed = toText(new Uint8Array(message.data));
	const { event, payload } = JSON.parse(messageParsed) as Events;

	const sentMessageEvent = new CustomEvent('@ws.sent_message', { detail: payload });
	const receiveTypingEvent = new CustomEvent('@ws.receive_typing', { detail: payload });
	const receiveMessageEvent = new CustomEvent('@ws.receive_message', { detail: payload });
	const receiveReadMessageEvent = new CustomEvent('@ws.receive_read_message', { detail: payload });
	const receiveMessageStatusEvent = new CustomEvent('@ws.receive_message_status', { detail: payload });

	console.log(event);

	const events = {
		sent_message: () => dispatchEvent(sentMessageEvent),
		receive_typing: () => dispatchEvent(receiveTypingEvent),
		receive_message: () => dispatchEvent(receiveMessageEvent),
		receive_read_message: () => dispatchEvent(receiveReadMessageEvent),
		receive_message_status: () => dispatchEvent(receiveMessageStatusEvent),
	};

	events[event]();
}
