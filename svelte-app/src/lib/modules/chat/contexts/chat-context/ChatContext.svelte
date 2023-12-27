<script lang="ts" context="module">
	export const setChatContext = () => setContext<Writable<State>>('chat-context', chatState);
	export const getChatContext = () => getContext<Writable<State>>('chat-context');
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { chatDispatch } from './stores/chat';
	import { setContext, getContext, onMount } from 'svelte';

	import { APIGetUserConversations } from '../../../../../services/api/get-user-conversations';
	import { saveConversationsAsyncDB } from '../../../../../services/database/use-cases/save-conversations';
	import { getConversationCacheAsyncDB } from '../../../../../services/database/use-cases/get-conversations-state';

	import type { Writable } from 'svelte/store';
	import type { State } from './stores/chat-store-types';

	import { chatState } from './stores/chat';

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
