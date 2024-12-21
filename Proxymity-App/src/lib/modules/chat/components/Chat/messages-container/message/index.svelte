<script lang="ts">
	import clsx from 'clsx';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	import { chatWorker } from '$lib/modules/chat/workers/db-worker/initializer';
	import { WorkerMethods } from '$lib/modules/chat/workers/db-worker/method-types';
	import { getStatusFromMessage } from '$lib/modules/chat/services/getStatusFromMessage';
	import { chatDispatch, chatState } from '$lib/modules/chat/contexts/chat-context/stores/chat';

	import type { ILocalMessage } from '../../../../../../../types/message';
	import { EMessageStatuses } from '../../../../../../../enums/EMessageStatuses';
	import { appColor } from '../../../../../../../contexts/theme/store';

	import MessageConfig from './message-config.svelte';
	import MessageTimestampContainer from './message-timestamp-container.svelte';
	import RepliedMessage from './replied-message.svelte';

	type Props = {
		message: ILocalMessage;
		previousMessage: ILocalMessage;
		selectMessage: () => void;
	};

	let { message, previousMessage, selectMessage }: Props = $props();

	let messageRef: HTMLLIElement;

	let isHighlighting = $state(false);
	let isMessageConfigVisible = $state(false);

	let session = $derived($page.data.session);
	let isMine = $derived(message.author?.id === session?.user?.id);

	type EventHandler = CustomEventInit<
		| {
				messageStatus: EMessageStatuses.SENT | EMessageStatuses.RECEIVED;
				messageId: string;
				conversationId: string;
				userId: string;
				type: 'message_status';
				appliedForAll: boolean;
		  }
		| {
				type: 'highlight';
				messageId: string;
		  }
	>;

	function messageEventHandler(event: EventHandler) {
		if (!event.detail) return;

		if (event.detail.type === 'message_status') {
			const { messageId, messageStatus, conversationId, userId, appliedForAll } = event.detail;

			if (messageStatus && messageId && conversationId) {
				chatDispatch.updateConversationMessageStatus({
					conversationId,
					messageId,
					status: messageStatus,
					userId,
					appliedForAll
				});
				$chatWorker?.postMessage({
					type: WorkerMethods.CHANGE_MESSAGE_STATUS,
					payload: { messageId: messageId, status: messageStatus }
				});
			}
		}

		if (event.detail.type === 'highlight') {
			isHighlighting = true;

			setTimeout(() => {
				isHighlighting = false;
			}, 2000);
		}
	}

	async function handleWithUpdateOfMessageStatus() {
		if ($chatState.conversations[$chatState.selectedConversationIndex]?.isGroup) {
			const response = await getStatusFromMessage(
				{ messageId: message.id, conversationId: message.conversationId },
				{ accessToken: session?.accessToken || '' }
			);

			chatDispatch.updateUsersFromMessageStatus({
				message,
				users: response.map((item) => ({
					readAt: item.readAt,
					receivedAt: item.receivedAt,
					userId: item.userId
				}))
			});
		} else {
			chatDispatch.updateUsersFromMessageStatus({ message, users: [] });
		}
	}

	onMount(() => {
		addEventListener(message.id, messageEventHandler);
		return () => removeEventListener(message.id, messageEventHandler);
	});
</script>

<li
	id={message.id}
	data-highlight={isHighlighting}
	class="flex w-full flex-col gap-1 rounded-[1rem] transition-all data-[highlight=true]:animate-pulse data-[highlight=true]:bg-foreground/30 data-[highlight=true]:p-3"
	bind:this={messageRef}
	oncontextmenu={() => selectMessage()}
	onfocus={() => (isMessageConfigVisible = true)}
	onblur={() => (isMessageConfigVisible = false)}
	onmouseover={() => (isMessageConfigVisible = true)}
	onmouseleave={() => (isMessageConfigVisible = false)}
>
	<MessageTimestampContainer {message} {previousMessage} {isMine} />

	<div class={clsx('relative flex items-center gap-2', { 'flex-row-reverse': isMine })}>
		<div
			class={clsx(
				'z-[13] w-fit min-w-[100px] max-w-[80%] rounded-[6px]  p-1 text-sm font-light shadow',
				{
					'rounded-tl-none bg-secondary brightness-150': !isMine,
					'rounded-tr-none bg-purple-500': isMine && $appColor === 'purple',
					'rounded-tr-none bg-blue-500': isMine && $appColor === 'blue',
					'rounded-tr-none bg-red-500': isMine && $appColor === 'red',
					'rounded-tr-none bg-green-600': isMine && $appColor === 'green',
					'rounded-tr-none bg-gray-800': isMine && $appColor === 'gray'
				}
			)}
		>
			{#if message.repliedMessage}
				<RepliedMessage {message} {isMine} />
			{/if}

			<p class={`break-words p-1 font-medium ${isMine ? 'text-white' : 'text-primary'}`}>
				{message.content}
			</p>
		</div>

		{#if isMessageConfigVisible}
			<MessageConfig {message} {isMine} />
		{/if}
	</div>
</li>
