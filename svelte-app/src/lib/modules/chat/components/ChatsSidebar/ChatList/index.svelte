<script lang="ts">
	import UserPlus from 'phosphor-svelte/lib/UserPlus';

	import Button from '$lib/design-system/Button.svelte';
	import Heading from '$lib/design-system/Heading.svelte';

	import ChatItem from './ChatItem.svelte';
	import { chatState } from '$lib/modules/chat/contexts/chat-context/stores/chat';

	let isNewContactModalOpened = false;

	let allNotificationsCount = 2;
</script>

<section
	class="flex flex-col dark:bg-gray-900 bg-white transition-colors rounded-[10px] p-3 relative overflow-hidden flex-1"
>
	<div class="flex gap-4 justify-between">
		<Heading size="md" className="flex gap-3 items-center">
			Chats

			{#if allNotificationsCount > 0}
				<span
					class="bg-purple-500 text-white rounded-full p-1 text-[0.6rem] flex items-center justify-center max-w-[1.25rem] max-h-[1.25rem] min-w-[1.25rem] min-h-[1.25rem]"
				>
					{allNotificationsCount}
				</span>
			{/if}
		</Heading>

		<Button
			tabIndex={-1}
			type="button"
			onClick={() => {
				isNewContactModalOpened = true;
			}}
			aria-label="add a new contact to your contact list"
		>
			<UserPlus class="text-white" size={24} /> Create chat
		</Button>
	</div>

	<div class="flex flex-col gap-[2px] mt-4 overflow-auto rounded-md h-full" role="list">
		{#each $chatState.conversations as conversation (conversation.id)}
			<ChatItem {conversation} />
		{/each}
	</div>

	<!-- <NewContactModal show={isNewContactModalOpened} closeModal={() => setIsNewContactModalOpened(false)} /> -->

	<div
		aria-hidden="true"
		class="absolute bottom-0 left-0 h-16 w-full z-10 bg-gradient-to-t dark:from-gray-900 transition-all from-gray-200 pointer-events-none"
	/>
</section>
