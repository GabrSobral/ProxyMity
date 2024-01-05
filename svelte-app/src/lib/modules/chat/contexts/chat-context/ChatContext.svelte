<script lang="ts" context="module">
	export let typebarRef = writable<HTMLInputElement | null>(null);

	let chatStateModule: State;
	let connectionModule: HubConnection | null;
	let userModule: Session['user'] | undefined;
	let accessToken: string;
	let typebarRefModule: HTMLInputElement | null;

	chatState.subscribe(value => {
		chatStateModule = value;
	});

	connection.subscribe(value => {
		connectionModule = value;
	});

	if (browser) {
		page.subscribe(value => {
			userModule = value.data?.session?.user as Session['user'] | undefined;
			accessToken = value.data?.session?.accessToken as string;
		});

		typebarRef.subscribe(value => {
			typebarRefModule = value;
		});
	}

	async function selectedConversationAsync(conversation: ConversationState) {
		if (conversation === chatStateModule.selectedConversation || !userModule) return;

		console.log({ notifications: conversation.notifications });

		if (conversation.notifications > 0 && connectionModule)
			sendReadMessageWebSocketEvent(connectionModule, {
				userId: userModule.id,
				conversationId: conversation.id,
				isConversationGroup: conversation.isGroup,
			});

		chatDispatch.selectConversation({ conversation, typeMessage: typebarRefModule?.value || '' });
		readConversationMessagesAsyncDB({
			conversationId: conversation.id,
			whoRead: userModule.id,
			myId: userModule.id,
			isConversationGroup: conversation.isGroup,
		});

		if (!conversation.hasMessagesFetched) {
			try {
				const { messages } = await APIGetConversationMessages({ conversationId: conversation.id }, { accessToken });
				chatDispatch.setConversationMessages({ conversationId: conversation.id, messages: messages.toReversed() });
			} catch (error) {
				console.error('Error fetching conversations, data will be taken from the cache', error);

				const messages = await getConversationsMessagesAsyncDB(conversation.id);
				chatDispatch.setConversationMessages({ conversationId: conversation.id, messages: messages.toReversed() });
			}
		}
	}

	interface ChatContextProps {
		typebarRef: Writable<HTMLInputElement | null>;
		selectedConversationAsync: (conversation: ConversationState) => Promise<void>;
	}

	export const getChatContext = () => getContext<ChatContextProps>('chat-context');
	export const setChatContext = () =>
		setContext<ChatContextProps>('chat-context', {
			typebarRef,
			selectedConversationAsync,
		});
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { chatDispatch } from './stores/chat';
	import type { Session } from '@auth/sveltekit';
	import { writable, type Writable } from 'svelte/store';
	import type { HubConnection } from '@microsoft/signalr';
	import { setContext, getContext, onMount } from 'svelte';

	import { chatState } from './stores/chat';
	import type { ConversationState, State } from './stores/chat-store-types';

	import { APIGetUserConversations } from '../../../../../services/api/get-user-conversations';
	import { APIGetConversationMessages } from '../../../../../services/api/get-conversation-messages';

	import { addMessageAsyncDB } from '../../../../../services/database/use-cases/add-message';
	import { saveConversationsAsyncDB } from '../../../../../services/database/use-cases/save-conversations';
	import { getConversationCacheAsyncDB } from '../../../../../services/database/use-cases/get-conversations-state';
	import { getConversationsMessagesAsyncDB } from '../../../../../services/database/use-cases/get-conversations-messages';
	import { readConversationMessagesAsyncDB } from '../../../../../services/database/use-cases/read-conversation-messages';

	import { connection } from '../websocket-context/stores/connection';
	import { sendReadMessageWebSocketEvent } from '../websocket-context/emmiters/sendReadMessage';
	import { sendReceiveMessageWebSocketEvent } from '../websocket-context/emmiters/sendReceiveMessage';

	import type { Message } from '../../../../../types/message';
	import { EMessageStatuses } from '../../../../../enums/EMessageStatuses';

	setChatContext();

	$: session = $page.data.session;

	onMount(() => {
		if (session?.user && session?.accessToken) {
			const user = session?.user;

			APIGetUserConversations({ id: user.id }, { accessToken: session.accessToken })
				.then(conversationsData => {
					console.log('Fetching conversations data was successfully.');

					chatDispatch.setConversationInitialState({ conversationsData, userId: user.id });

					const filteredData = conversationsData.map(data => ({
						...data,
						participants: data.participants.filter(item => item.id !== user.id),
					}));

					saveConversationsAsyncDB(filteredData)
						.then(() => console.log('Local database was successfully synchronized with API data.'))
						.catch(error => console.error('Error on try to synchronize API data with local database', error.message));
				})
				.catch(error => {
					console.error('Error on trying to fetch conversations, data will be taken from the cache', error.message);

					getConversationCacheAsyncDB({ userId: user.id })
						.then(conversationsData => chatDispatch.setConversationInitialState({ conversationsData, userId: user.id }))
						.catch(console.error);
				});
		}
	});

	function receiveMessageHandler(message: Message) {
		console.trace({ receiveMessageHandler: message });
		if (!message || !session?.user || !$connection) {
			return;
		}

		if ($chatState.selectedConversation && $chatState.selectedConversation?.id === message.conversationId) {
			sendReceiveMessageWebSocketEvent($connection, {
				userId: session?.user.id,
				conversationId: message.conversationId,
				messageId: message.id,
				isConversationGroup: $chatState.selectedConversation.isGroup,
			});

			sendReadMessageWebSocketEvent($connection, {
				userId: session?.user.id,
				conversationId: $chatState.selectedConversation.id,
				isConversationGroup: $chatState.selectedConversation.isGroup,
			});
		} else {
			const messageConversation = $chatState.conversations.find(item => item.id === message.conversationId);

			if (messageConversation && $connection)
				sendReceiveMessageWebSocketEvent($connection, {
					userId: session?.user.id,
					conversationId: message.conversationId,
					messageId: message.id,
					isConversationGroup: messageConversation?.isGroup,
				});
		}

		const payload: Message = {
			...message,
			receivedByAllAt: new Date(),
			readByAllAt: $chatState.selectedConversation?.id === message.conversationId ? new Date() : null,
		};

		addMessageAsyncDB(payload);
		chatDispatch.addMessage({ message: payload });
		chatDispatch.bringToTop(message.conversationId);
	}

	function receiveReadMessageHandler(userId: string, conversationId: string, isConversationGroup: boolean) {
		console.trace('receive Read Message');

		if (!session?.user) return;

		chatDispatch.updateConversationMessageStatus({ conversationId, status: EMessageStatuses.READ });
		readConversationMessagesAsyncDB({ conversationId, myId: session?.user?.id, whoRead: userId, isConversationGroup });
	}

	function receiveMessageStatusHandler(messageStatus: string, messageId: string, conversationId: string) {
		const messageStatusEvent = new CustomEvent(messageId, { detail: { messageStatus, messageId, conversationId } });
		dispatchEvent(messageStatusEvent);
	}

	$: if ($connection) {
		$connection?.on('receivemessage', receiveMessageHandler);
		$connection?.on('receivereadmessage', receiveReadMessageHandler);
		$connection?.on('receivemessagestatus', receiveMessageStatusHandler);
	}
</script>

<slot />
