<script lang="ts">
	import { ulid } from 'ulidx';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { PaperPlaneTilt, X } from 'phosphor-svelte';

	import Button from '$lib/design-system/Button.svelte';
	import InputGroup from '$lib/design-system/Input/InputGroup.svelte';

	import { connection } from '$lib/modules/chat/contexts/websocket-context/stores/connection';
	import { getChatContext } from '$lib/modules/chat/contexts/chat-context/ChatContext.svelte';
	import { chatDispatch, chatState } from '$lib/modules/chat/contexts/chat-context/stores/chat';
	import { sendTypingWebSocketEvent } from '$lib/modules/chat/contexts/websocket-context/emmiters/sendTyping';
	import { sendMessageWebSocketEvent } from '$lib/modules/chat/contexts/websocket-context/emmiters/sendMessage';

	import { addMessageAsyncDB } from '../../../../../../services/database/use-cases/add-message';
	import { changeMessageStatusAsyncDB } from '../../../../../../services/database/use-cases/change-message-status';

	import type { Message } from '../../../../../../types/message';
	import { EMessageStatuses } from '../../../../../../enums/EMessageStatuses';

	let typeValueManaged = '';

	$: if ($chatState.selectedConversation && $typebarRef) {
		$typebarRef.value = $chatState.selectedConversation?.typeMessage;
	}

	let { typebarRef } = getChatContext();

	$: user = $page.data.session?.user;

	async function sendMessage() {
		if (!user || !$chatState.selectedConversation || !$typebarRef?.value.trim()) return;

		const message: Message = {
			id: ulid(),
			content: $typebarRef?.value.trim(),

			writtenAt: new Date(),
			sentAt: null,
			receivedByAllAt: null,
			readByAllAt: null,

			conversationId: $chatState.selectedConversation?.id,
			authorId: user.id,

			repliedMessageId: $chatState.selectedConversation.replyMessage?.id || null,
		};

		addMessageAsyncDB(message).catch(error => {
			console.error(`Error on trying to add the "${message.id}" message at Indexed DB`, error);
		});

		chatDispatch.addMessage({ message });
		chatDispatch.bringToTop(message.conversationId);

		if ($connection) {
			sendMessageWebSocketEvent($connection, {
				message: { ...message, sentAt: new Date() },
				isConversationGroup: $chatState.selectedConversation.isGroup,
			});

			changeMessageStatusAsyncDB({ messageId: message.id, status: EMessageStatuses.SENT }).catch(error => {
				console.error(`Error on trying to update the "${message.id}" message status at Indexed DB`, error);
			});
		} else {
			console.error('Connection not established!');
		}

		chatDispatch.saveTypeMessageFromConversation({
			conversationId: $chatState.selectedConversation.id,
			typeMessage: '',
		});

		$typebarRef.value = '';
		typeValueManaged = '';

		chatDispatch.removeReplyMessageFromConversation({ conversationId: $chatState.selectedConversation.id });
	}

	function handleSpreadTypingStatusToConversation(typing: boolean) {
		if ($connection) {
			sendTypingWebSocketEvent($connection, {
				typing,
				conversationId: $chatState.selectedConversation?.id || '',
				authorId: user?.id || '',
			});
		} else {
			console.error('Connection not established!');
		}
	}

	onMount(() => {
		$typebarRef?.addEventListener('input', (e: any) => {
			const value = e.target.value as string;

			if (value && !typeValueManaged) {
				handleSpreadTypingStatusToConversation(true);
			} else if (!value && typeValueManaged) {
				handleSpreadTypingStatusToConversation(false);
			}

			typeValueManaged = $typebarRef?.value || '';
		});
	});
</script>

<div class="flex flex-col gap-2 m-1 mt-auto">
	{#if $chatState.selectedConversation?.replyMessage}
		<div class="w-full p-2 flex gap-2 bg-black rounded-lg">
			<div class="bg-gray-950 w-full p-2 rounded-md flex flex-col gap-1">
				<span class="text-purple-300 text-xs">
					{typeof $chatState.selectedConversation?.replyMessage === 'object' &&
						$chatState.selectedConversation?.replyMessage.authorId}
				</span>

				<span class="text-white text-sm">
					{typeof $chatState.selectedConversation?.replyMessage === 'object' &&
						$chatState.selectedConversation?.replyMessage.content}
				</span>
			</div>

			<button
				type="button"
				title="Cancel reply message"
				on:click={() =>
					chatDispatch.removeReplyMessageFromConversation({
						conversationId: $chatState.selectedConversation?.id || '',
					})}
				class="ml-auto bg-gray-900 hover:brightness-125 flex items-center justify-center rounded-full max-w-[2.5rem] min-w-[2.5rem] max-h-[2.5rem] min-h-[2.5rem]"
			>
				<X size={24} color="white" />
			</button>
		</div>
	{/if}

	<InputGroup let:Label let:Wrapper className="flex w-full">
		<Label className="sr-only">Type a message</Label>

		<Wrapper className="w-full h-fit">
			<input
				bind:this={$typebarRef}
				type="text"
				class="max-h-[20rem] min-h-[3.5rem] resize-none flex flex-1 py-3 focus:outline-none outline-none hover:ring-1 transition-all dark:ring-gray-700 ring-gray-100 rounded-md dark:bg-gray-900 bg-white dark:text-gray-200 text-gray-700 focus:outline-purple-500 focus:ring-0 dark:placeholder:text-gray-400 placeholder:text-gray-600 w-full px-4"
				placeholder="Type your message"
				autoComplete="off"
				id="typebar-input-id"
			/>

			<Button
				tabIndex={2}
				type="button"
				title="Send message"
				onClick={sendMessage}
				className="p-2 absolute right-3 top-2/4 -translate-y-2/4 min-w-[2.75rem] min-h-[2.75rem] max-w-[2.75rem] max-h-[2.75rem] mt-auto rounded-[10px]"
			>
				<PaperPlaneTilt class="text-white" size={24} />
			</Button>
		</Wrapper>
	</InputGroup>
</div>
