<script lang="ts">
	import autoAnimate from '@formkit/auto-animate';

	import ChatItem from './chat-item.svelte';
	import ChatItemSkeleton from './chat-item-skeleton.svelte';

	import { chatState } from '$lib/modules/chat/contexts/chat-context/stores/chat';
	import type { ConversationState } from '$lib/modules/chat/contexts/chat-context/stores/chat-store-types';

	let pinnedConversations = $derived(
		$chatState.conversations.filter((item) => item.conversationPinnedAt).sort()
	);
	let unpinnedConversations = $derived(
		$chatState.conversations.filter((item) => !item.conversationPinnedAt)
	);
</script>

{#snippet ConversationsWithLoading(conversations: ConversationState[])}
	{#if $chatState.isFetchingConversations}
		{#each [0, 1, 2, 3] as _}<ChatItemSkeleton />{/each}
	{:else}
		{#each conversations as conversation, conversationIndex (conversation.id)}
			<ChatItem {conversation} {conversationIndex} />
		{/each}
	{/if}
{/snippet}

<section class="relative flex flex-1 flex-col gap-3 overflow-hidden transition-all">
	{#if pinnedConversations.length}
		<div class="flex flex-col gap-[2px] rounded-md px-1 py-2" role="list" use:autoAnimate>
			{@render ConversationsWithLoading(pinnedConversations)}
		</div>
	{/if}

	<div
		class="flex h-full flex-col gap-[2px] overflow-auto rounded-md p-1"
		role="list"
		use:autoAnimate
	>
		{@render ConversationsWithLoading(unpinnedConversations)}
	</div>
</section>
