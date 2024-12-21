<script lang="ts">
	import { page } from '$app/stores';

	import Text from '$lib/components/ui/text.svelte';
	import * as ContextMenu from '$lib/components/ui/context-menu';

	import Message from './message/index.svelte';
	import Typebar from './typebar/index.svelte';
	import NoMessagesSent from './no-messages-sent.svelte';
	import TypingContainer from './typing-container.svelte';
	import MessageContextMenu from './message-context-menu.svelte';
	import MessageStatusDialog from './message-status-dialog.svelte';
	import ScrollToBottomButton from './scroll-to-bottom-button.svelte';
	import UnreadMessagesSeparator from './unread-messages-separator.svelte';

	import { notificationsState } from '$lib/modules/chat/contexts/chat-context/stores/notification';
	import {
		chatState,
		messagesContainer
	} from '$lib/modules/chat/contexts/chat-context/stores/chat';

	import type { ILocalMessage } from '../../../../../../types/message';

	let userId = $derived($page.data.session?.user.id);

	let isMessageStatusDialogOpened = $state(false);
	let selectedMessage = $state<ILocalMessage | null>(null);

	let firstUnreadMessageId = $derived(
		$notificationsState.lastMessagesHistory.find(
			(item) =>
				item.conversationId ===
					$chatState.conversations[$chatState.selectedConversationIndex]?.id &&
				item.authorId !== userId
		)?.messageId || null
	);

	$effect(() => {
		$chatState.conversations[$chatState.selectedConversationIndex]?.messages;

		// Scroll the messages container to bottom using the "auto" behavior
		$messagesContainer?.scroll({ top: $messagesContainer.scrollHeight, behavior: 'auto' });
	});
</script>

<ScrollToBottomButton />

<ContextMenu.Root>
	<ContextMenu.Trigger
		class="relative mx-auto flex h-full w-full max-w-3xl flex-1 flex-col overflow-hidden p-1 transition-all"
	>
		<ul
			class="flex flex-col gap-2 overflow-auto p-4 pb-10 transition-all"
			bind:this={$messagesContainer}
		>
			{#if !$chatState.conversations[$chatState.selectedConversationIndex]?.hasMessagesFetched}
				<Text size="md">Loading messages...</Text>
			{/if}

			{#if $chatState.conversations[$chatState.selectedConversationIndex]?.messages.length === 0}
				<NoMessagesSent />
			{:else if $chatState.conversations[$chatState.selectedConversationIndex]?.messages}
				{#each $chatState.conversations[$chatState.selectedConversationIndex]?.messages as message, i (message.id)}
					{#if firstUnreadMessageId === message.id}
						<UnreadMessagesSeparator />
					{/if}

					<Message
						{message}
						previousMessage={$chatState.conversations[$chatState.selectedConversationIndex]
							?.messages?.[i - 1]}
						selectMessage={() => (selectedMessage = message)}
					/>
				{/each}
			{/if}
		</ul>

		<TypingContainer />
		<Typebar />

		<MessageStatusDialog
			{selectedMessage}
			isOpened={isMessageStatusDialogOpened}
			closeDialog={() => (isMessageStatusDialogOpened = false)}
		/>
	</ContextMenu.Trigger>

	<MessageContextMenu {selectedMessage} {isMessageStatusDialogOpened} />
</ContextMenu.Root>
