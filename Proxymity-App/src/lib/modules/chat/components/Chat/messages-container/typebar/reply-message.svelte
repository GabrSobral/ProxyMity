<script lang="ts">
	import { chatDispatch, chatState } from '$lib/modules/chat/contexts/chat-context/stores/chat';
	import type { ConversationState } from '$lib/modules/chat/contexts/chat-context/stores/chat-store-types';
	import { X } from 'lucide-svelte';

	let { conversationId }: { conversationId: ConversationState['id'] } = $props();
</script>

<div class="flex w-full gap-2 rounded-lg bg-background p-2">
	<div class="flex w-full flex-col gap-1 rounded-md bg-secondary p-2">
		<span class="text-xs font-semibold text-purple-500">
			{typeof $chatState.conversations[$chatState.selectedConversationIndex]?.replyMessage ===
				'object' &&
				$chatState.conversations[$chatState.selectedConversationIndex]?.replyMessage?.author.name}
		</span>

		<span class="text-sm text-primary">
			{typeof $chatState.conversations[$chatState.selectedConversationIndex]?.replyMessage ===
				'object' &&
				$chatState.conversations[$chatState.selectedConversationIndex].replyMessage?.content}
		</span>
	</div>

	<button
		type="button"
		title="Cancel reply message"
		onclick={() => chatDispatch.removeReplyMessageFromConversation({ conversationId })}
		class="ml-auto flex max-h-[2.5rem] min-h-[2.5rem] min-w-[2.5rem] max-w-[2.5rem] items-center justify-center rounded-full bg-gray-900 hover:brightness-125"
	>
		<X size={24} color="white" />
	</button>
</div>
