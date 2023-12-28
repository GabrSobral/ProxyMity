<script lang="ts">
	import clsx from 'clsx';
	import { User } from 'phosphor-svelte';
	import { page } from '$app/stores';
	import { twMerge } from 'tailwind-merge';

	import { connection } from '$lib/modules/chat/contexts/websocket-context/stores/connection';
	import { chatDispatch, chatState } from '$lib/modules/chat/contexts/chat-context/stores/chat';
	import type { ConversationState } from '$lib/modules/chat/contexts/chat-context/stores/chat-store-types';
	import { getChatContext } from '$lib/modules/chat/contexts/chat-context/ChatContext.svelte';

	$: user = $page.data.session?.user;
	$: lastMessage = conversation.messages?.at(-1);
	$: isSelectedContact = $chatState.selectedConversation?.id === conversation.id;

	$connection?.on('receiveTyping', (typingWs, authorId, conversationId) => {
		if (conversationId === conversation.id) {
			typing = typingWs;
		}
	});

	let { selectedConversationAsync } = getChatContext();

	export let conversation: ConversationState;

	const conversationName =
		conversation?.groupName || conversation?.participants.find(item => item.id !== user?.id)?.name || '';

	let typing = false;

	const formatLastMessageDate = Intl.DateTimeFormat('pt-br', { hour: 'numeric', minute: 'numeric' });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	role="button"
	tabindex="0"
	class="w-full hover:dark:border-gray-700 hover:border-gray-100 border-[1px] dark:border-gray-900 border-white relative py-2 px-3 rounded-md flex gap-4 cursor-pointer hover:opacity-90 group dark:bg-gray-900 bg-white transition-all shadow-md"
	on:click={() => selectedConversationAsync({ conversation })}
>
	<div
		class={`${
			isSelectedContact ? 'w-full left-0 opacity-100' : 'w-0 left-2/4 opacity-10'
		} absolute h-full gradient transition-all rounded-md top-0 z-0 duration-[0.3s] mx-auto`}
	/>

	<div class="relative min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px]">
		<div
			class="min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px] rounded-full z-0 shadow-xl flex items-center justify-center dark:bg-gray-700 bg-white transition-colors"
		>
			<User size={20} class="dark:text-white text-gray-700 transition-colors" />
		</div>
	</div>

	<div class={'flex flex-col overflow-hidden w-full z-10'}>
		<span
			class={`${
				isSelectedContact ? 'text-white' : 'text-gray-700 dark:text-gray-200'
			} truncate font-medium flex items-center justify-between gap-3 `}
		>
			{conversationName}
			{#if conversation.id === user?.id}
				(You)
			{/if}

			<span
				class="text-[12px] dark:text-gray-200 transition-colors text-gray-700 ml-auto data-[is-selected=true]:text-gray-100"
				data-is-selected={isSelectedContact}
			>
				{formatLastMessageDate.format(new Date())}
			</span>
		</span>

		<div
			class={twMerge(
				clsx('truncate flex justify-between gap-4 dark:text-gray-200 text-gray-600 text-sm', {
					'text-purple-500': typing && !isSelectedContact,
					'text-white': isSelectedContact,
				})
			)}
		>
			{#if typing}
				<span>Typing...</span>
			{:else if lastMessage}
				<span>{lastMessage.content}</span>
			{:else}
				<span>Start the conversation...</span>
			{/if}

			{#if conversation.notifications > 0}
				<span
					class="rounded-full bg-purple-500 w-5 h-5 ml-auto flex items-center justify-center text-[12px] text-white font-medium animate-pulse z-10"
				>
					{conversation.notifications}
				</span>
			{/if}
		</div>
	</div>
</div>
