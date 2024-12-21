<script lang="ts">
	import { Share } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	import { typebarRef } from '$lib/modules/chat/contexts/chat-context/stores/chat';
	import { chatDispatch } from '$lib/modules/chat/contexts/chat-context/stores/chat';

	import type { ILocalMessage } from '../../../../../../../types/message';

	let { isMine, message } = $props<{ message: ILocalMessage; isMine: boolean }>();
</script>

<button
	type="button"
	transition:fly={{ duration: 300, x: isMine ? 30 : -30, opacity: 0 }}
	class="z-10 rounded-full bg-gray-700 p-2 shadow-lg transition-all hover:brightness-90 active:scale-95"
	onclick={() => {
		$typebarRef?.focus();
		chatDispatch.setReplyMessageFromConversation({
			conversationId: message.conversationId,
			message
		});
	}}
>
	<Share size={12} color="white" />
</button>
