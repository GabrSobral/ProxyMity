<script lang="ts">
	import { ulid } from 'ulidx';
	import { page } from '$app/stores';
	import { Send, X } from 'lucide-svelte';

	import Button from '$lib/components/ui/button/button.svelte';
	import InputGroup from '$lib/components/ui/Input/InputGroup.svelte';

	import { chatWorker } from '$lib/modules/chat/workers/db-worker/initializer';
	import { WorkerMethods } from '$lib/modules/chat/workers/db-worker/method-types';
	import {
		messagesContainer,
		typebarRef
	} from '$lib/modules/chat/contexts/chat-context/stores/chat';
	import { webSocketEmitter } from '$lib/modules/chat/contexts/websocket-context/stores/connection';
	import { chatDispatch, chatState } from '$lib/modules/chat/contexts/chat-context/stores/chat';

	import type { ILocalMessage } from '../../../../../../../types/message';
	import { EMessageStatuses } from '../../../../../../../enums/EMessageStatuses';
	import { notificationsDispatch } from '$lib/modules/chat/contexts/chat-context/stores/notification';
	import ReplyMessage from './reply-message.svelte';

	let user = $derived($page.data.session?.user);
	let conversationId = $derived(
		$chatState.conversations[$chatState.selectedConversationIndex]?.id || ''
	);

	let typeValueManaged = $state('');

	async function sendMessage() {
		if (
			!user ||
			!$chatState.conversations[$chatState.selectedConversationIndex] ||
			!$typebarRef?.value.trim()
		)
			return;

		const message: ILocalMessage = {
			id: ulid(),
			content: $typebarRef?.value.trim(),
			writtenAt: new Date(),
			sentAt: null,
			received: { byAllAt: null, users: [] },
			read: { byAllAt: null, users: [] },
			conversationId,
			author: { id: user.id, name: user.name },
			repliedMessage: $chatState.conversations[$chatState.selectedConversationIndex].replyMessage
				? {
						id: $chatState.conversations[$chatState.selectedConversationIndex].replyMessage!.id,
						content:
							$chatState.conversations[$chatState.selectedConversationIndex].replyMessage!.content
					}
				: null
		};

		$chatWorker?.postMessage({ type: WorkerMethods.ADD_MESSAGE, payload: { message } });

		chatDispatch.addMessage({ message });
		chatDispatch.bringToTop(message.conversationId);

		$webSocketEmitter?.sendMessage({
			message,
			isConversationGroup: $chatState.conversations[$chatState.selectedConversationIndex].isGroup
		});

		$chatWorker?.postMessage({
			type: WorkerMethods.CHANGE_MESSAGE_STATUS,
			payload: { messageId: message.id, status: EMessageStatuses.SENT }
		});

		chatDispatch.saveTypeMessageFromConversation({ conversationId, typeMessage: '' });

		$typebarRef.value = '';
		typeValueManaged = '';

		chatDispatch.removeReplyMessageFromConversation({
			conversationId: $chatState.conversations[$chatState.selectedConversationIndex].id
		});

		$messagesContainer?.scroll({ top: $messagesContainer.scrollHeight + 160, behavior: 'smooth' });

		notificationsDispatch.clearLastMessagesHistoryFromConversation(
			$chatState.conversations[$chatState.selectedConversationIndex]
		);
	}

	function handleSpreadTypingStatusToConversation(typing: boolean) {
		$webSocketEmitter?.sendTyping({ conversationId, typing, authorId: user?.id || '' });
	}

	$effect(() => {
		$typebarRef?.addEventListener('input', (e: any) => {
			const value = e.target.value as string;

			if (value && !typeValueManaged) {
				handleSpreadTypingStatusToConversation(true);
			} else if (!value && typeValueManaged) {
				handleSpreadTypingStatusToConversation(false);
			}

			typeValueManaged = $typebarRef?.value || '';
		});

		$typebarRef?.addEventListener('keypress', async (e: KeyboardEvent) => {
			if (e.code === 'Enter') {
				sendMessage();
			}
		});
	});
</script>

<div class="z-[21] m-1 mt-auto flex flex-col gap-2">
	{#if $chatState.conversations[$chatState.selectedConversationIndex]?.replyMessage}
		<ReplyMessage {conversationId} />
	{/if}

	<InputGroup let:Label let:Wrapper className="flex w-full ">
		<Label className="sr-only">Type a message</Label>

		<Wrapper className="w-full h-fit">
			<input
				id="typebar-input-id"
				bind:this={$typebarRef}
				type="text"
				class="flex max-h-[20rem] min-h-[3rem] w-full flex-1 resize-none rounded-md border border-black/30 px-4 py-3 text-primary shadow-sm outline-none ring-gray-700 transition-all placeholder:text-gray-400 hover:ring-1 focus:outline-none focus:outline-purple-500 focus:ring-0"
				placeholder="Type your message"
				autoComplete="off"
			/>

			<Button
				type="button"
				title="Send message"
				onclick={sendMessage}
				class="absolute right-2 top-2/4 mt-auto max-h-[2.75rem] min-h-[2.25rem] min-w-[2.25rem] max-w-[2.75rem] -translate-y-2/4 rounded-[10px] p-2"
			>
				<Send size={18} class="text-white" />
			</Button>
		</Wrapper>
	</InputGroup>
</div>
