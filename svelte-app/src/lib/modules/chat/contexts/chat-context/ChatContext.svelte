<script lang="ts" context="module">
	export let typebarRef = writable<HTMLInputElement | null>(null);

	let chatStateModule: State;
	let connectionModule: HubConnection | null;
	let userModule: Session['user'] | undefined;
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
		});

		typebarRef.subscribe(value => {
			typebarRefModule = value;
		});
	}

	async function selectedConversationAsync({ conversation }: { conversation: ConversationState }) {
		if (conversation === chatStateModule.selectedConversation || !userModule) return;

		chatDispatch.saveTypeMessageFromConversation({
			conversationId: chatStateModule.selectedConversation?.id || '',
			typeMessage: typebarRefModule?.value || '',
		});

		chatDispatch.selectConversation(conversation);

		if (!conversation.hasMessagesFetched) {
			try {
				const { messages } = await APIGetConversationMessages({ conversationId: conversation.id });
				chatDispatch.setConversationMessages({ conversationId: conversation.id, messages });
			} catch (error) {
				console.error('Error fetching conversations, data will be taken from the cache', error);

				const messages = await getConversationsMessagesAsyncDB(conversation.id);
				chatDispatch.setConversationMessages({ conversationId: conversation.id, messages });
			}
		}

		chatDispatch.updateConversationMessageStatus({ conversationId: conversation.id, status: 'read' });
		readConversationMessagesAsyncDB({ conversationId: conversation.id, userId: userModule.id });

		if (conversation.notifications > 0 && connectionModule)
			sendReadMessageWebSocketEvent(connectionModule, {
				userId: userModule.id,
				conversationId: conversation.id,
				isConversationGroup: conversation.isGroup,
			});
	}

	interface ChatContextProps {
		typebarRef: Writable<HTMLInputElement | null>;
		selectedConversationAsync: (params: { conversation: ConversationState }) => Promise<void>;
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
	import { chatDispatch } from './stores/chat';
	import { setContext, getContext, onMount } from 'svelte';

	// import { selectedConversationAsync } from './functions/selectedConversationAsync.svelte';

	import { APIGetUserConversations } from '../../../../../services/api/get-user-conversations';
	import { saveConversationsAsyncDB } from '../../../../../services/database/use-cases/save-conversations';
	import { getConversationCacheAsyncDB } from '../../../../../services/database/use-cases/get-conversations-state';

	import { chatState } from './stores/chat';
	import type { ConversationState, State } from './stores/chat-store-types';

	import { writable, type Writable } from 'svelte/store';
	import type { HubConnection } from '@microsoft/signalr';
	import type { Session } from '@auth/sveltekit';
	import { connection } from '../websocket-context/stores/connection';
	import { browser } from '$app/environment';
	import { APIGetConversationMessages } from '../../../../../services/api/get-conversation-messages';
	import { getConversationsMessagesAsyncDB } from '../../../../../services/database/use-cases/get-conversations-messages';
	import { readConversationMessagesAsyncDB } from '../../../../../services/database/use-cases/read-conversation-messages';
	import { sendReadMessageWebSocketEvent } from '../websocket-context/emmiters/sendReadMessage';

	setChatContext();

	$: session = $page.data.session;
	$: console.log({ state: $chatState });

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
</script>

<slot />
