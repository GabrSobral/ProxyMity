<script lang="ts">
	import Heading from '$lib/design-system/Heading.svelte';
	import { chatState } from '$lib/modules/chat/contexts/chat-context/stores/chat';
	import { Scroll } from 'phosphor-svelte';

	import Message from './Message.svelte';
	import Typebar from './Typebar.svelte';
	import { writable } from 'svelte/store';
	import ScrollToBottomButton from './ScrollToBottomButton.svelte';

	const conversationMessages = writable($chatState.selectedConversation?.messages || []);

	let isFirstAccess = false;
	let messagesContainer: HTMLUListElement;

	$: if ($chatState.selectedConversation) {
		isFirstAccess = true;
	}

	$: console.log({ isFirstAccess });

	$: if (messagesContainer && messagesContainer.scrollHeight > messagesContainer.clientHeight) {
		messagesContainer.scroll({
			top: messagesContainer.scrollHeight,
			behavior: isFirstAccess ? 'auto' : 'smooth',
		});

		isFirstAccess = false;
	}
</script>

<div class="overflow-hidden w-full flex-1 h-full flex flex-col p-1 relative">
	<ul class="flex flex-col gap-2 overflow-auto p-4" bind:this={messagesContainer}>
		{#if $chatState.selectedConversation?.messages.length === 0}
			<div class="flex-1 flex items-center justify-center flex-col gap-3 pointer-events-none">
				<img src="/no-messages.svg" alt="No message" class="w-[25rem]" />
				<Heading size="sm" className="opacity-80">No messages have been sent yet...</Heading>
			</div>
		{:else if $chatState.selectedConversation?.messages}
			{#each $conversationMessages as message, i (message.id)}
				<Message {message} previousMessage={$conversationMessages?.[i - 1]} />
			{/each}
		{/if}
	</ul>

	<ScrollToBottomButton container={messagesContainer} />
	<Typebar />
</div>
