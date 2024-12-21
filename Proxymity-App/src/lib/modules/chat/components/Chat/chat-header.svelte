<script lang="ts">
	import clsx from 'clsx';
	import { page } from '$app/stores';
	import { User, X } from 'lucide-svelte';

	import * as Avatar from '$lib/components/ui/avatar';

	import { chatDispatch, chatState } from '../../contexts/chat-context/stores/chat';

	const userId = $derived($page.data.session?.user?.id || '');
	const conversationName = $derived(
		$chatState.conversations[$chatState.selectedConversationIndex]?.groupName ||
			$chatState.conversations[$chatState.selectedConversationIndex]?.participants.find(
				(item) => item.id !== userId
			)?.firstName ||
			''
	);
</script>

<header
	class="z-10 flex items-center gap-4 overflow-hidden bg-background px-3 py-2 shadow-md transition-all"
>
	<Avatar.Root>
		<Avatar.Image src="https://github.com/shadcn.png" />
	</Avatar.Root>
	<!-- username={conversationName}  -->

	<h2 class="font-dark overflow-ellipsis tracking-wide text-primary transition-all">
		Conversation with <strong class="text-primary">{conversationName}</strong>
	</h2>

	<div class="ml-auto flex gap-1">
		{#if userId}
			<button
				type="button"
				onclick={() =>
					chatDispatch.selectConversation({
						conversation: null,
						typeMessage: '',
						currentUserId: userId
					})}
				title="Close chat"
				class="group rounded-full bg-black p-2 text-white transition-all hover:bg-purple-500 hover:text-white"
			>
				<X size={24} class="text-white group-hover:text-white" />
			</button>
		{/if}
	</div>
</header>
