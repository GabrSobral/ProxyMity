<script lang="ts">
	import { fly } from 'svelte/transition';

	import colors from 'tailwindcss/colors';

	import * as Avatar from '$lib/components/ui/avatar';
	import LoadingDots from '$lib/components/ui/loading-dots.svelte';
	import { chatState } from '$lib/modules/chat/contexts/chat-context/stores/chat';
	import type { ConversationState } from '$lib/modules/chat/contexts/chat-context/stores/chat-store-types';

	import { cn } from '$lib/utils';

	let participantsTyping = $state<
		{ author: ConversationState['participants'][0] | null; isTyping: boolean }[]
	>([]);

	$effect(() => {
		const participants =
			$chatState.conversations[$chatState.selectedConversationIndex]?.participants || [];
		const typing = $chatState.conversations[$chatState.selectedConversationIndex]?.typing || [];

		participantsTyping = typing.map((item) => ({
			isTyping: item.isTyping,
			author: participants.find((participant) => participant.id === item.authorId) || null
		}));
	});
</script>

{#if participantsTyping.length}
	<div
		class={cn(
			'absolute bottom-[3.5rem] z-[20] mx-1 mb-1 flex w-fit items-center gap-2 rounded-lg bg-gray-900 px-4 py-1',
			{
				'bottom-[8.5rem]':
					$chatState.conversations[$chatState.selectedConversationIndex]?.replyMessage
			}
		)}
		transition:fly={{ y: 40, opacity: 0 }}
	>
		<div class="flex">
			{#each participantsTyping as participantTyping (participantTyping.author?.id)}
				<div class="-ml-2 rounded-full shadow-lg" title={participantTyping.author?.firstName}>
					<Avatar.Root>
						<Avatar.Image src="https://github.com/shadcn.png" />
					</Avatar.Root>
					<span class="sr-only">{participantTyping.author?.firstName}</span>
				</div>
			{/each}
		</div>

		<span class="flex items-end gap-0 text-xs text-white">
			{#if participantsTyping.length > 1}
				are typing
			{:else}
				is typing
			{/if}
			<span class="mt-[8px]">
				<LoadingDots size={6} color={colors.purple[500]} />
			</span>
		</span>
	</div>
{/if}
