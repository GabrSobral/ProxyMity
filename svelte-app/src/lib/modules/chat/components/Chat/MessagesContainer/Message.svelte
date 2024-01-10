<script lang="ts">
	import clsx from 'clsx';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { Clock, ShareFat } from 'phosphor-svelte';

	import { chatDispatch, chatState } from '$lib/modules/chat/contexts/chat-context/stores/chat';

	import type { ILocalMessage } from '../../../../../../types/message';
	import { EMessageStatuses } from '../../../../../../enums/EMessageStatuses';
	import { changeMessageStatusAsyncDB } from '../../../../../../services/database/use-cases/change-message-status';

	export let message: ILocalMessage;
	export let previousMessage: ILocalMessage;

	let isMessageConfigVisible = false;
	const previousIsFromUser = previousMessage?.author?.id === message.author?.id;
	const formatter = Intl.DateTimeFormat('pt-br', { hour: 'numeric', minute: 'numeric' });
	const selectTimeToShow = (isMine: boolean, message: ILocalMessage) => formatter.format(new Date(message.writtenAt));

	$: timeToShow = selectTimeToShow(isMine, message);
	$: user = $page.data.session?.user;
	$: isMine = message.author?.id === user?.id;
	$: status = (() => {
		if (message.read.byAllAt !== null) return EMessageStatuses.READ;
		if (message.received.byAllAt !== null) return EMessageStatuses.RECEIVED;
		if (message.sentAt !== null) return EMessageStatuses.SENT;

		return EMessageStatuses.WROTE;
	})();

	type EventHandler = CustomEventInit<{
		messageStatus: EMessageStatuses.SENT | EMessageStatuses.RECEIVED;
		messageId: string;
		conversationId: string;
		userId: string;
	}>;

	function handler(event: EventHandler) {
		if (!event.detail) {
			return;
		}

		const { messageId, messageStatus, conversationId, userId } = event.detail;

		if (messageStatus && messageId && conversationId) {
			status = messageStatus;
			chatDispatch.updateConversationMessageStatus({
				conversationId,
				messageId: message.id,
				status: messageStatus,
				userId,
			});
			changeMessageStatusAsyncDB({ messageId: messageId, status: messageStatus });
		}
	}

	onMount(() => {
		addEventListener(message.id, handler);
		return () => removeEventListener(message.id, handler);
	});
</script>

<li
	on:mouseover={() => {
		isMessageConfigVisible = true;
	}}
	on:focus={() => {
		isMessageConfigVisible = true;
	}}
	on:mouseout={() => {
		isMessageConfigVisible = false;
	}}
	on:blur={() => {
		isMessageConfigVisible = false;
	}}
	class="flex flex-col gap-1 rounded-[1rem] w-full"
>
	<div
		class={clsx(
			'flex items-center gap-3 sticky dark:bg-gray-900 bg-white transition-colors p-1 px-2 rounded-full w-fit -top-3',
			{
				'ml-auto': isMine,
			}
		)}
	>
		{#if !isMine && !previousIsFromUser}
			<img
				src="https://github.com/diego3g.png"
				alt="User"
				width={30}
				height={30}
				class="min-w-[30px] min-h-[30px] rounded-full z-0 shadow-xl"
			/>
			<span class="dark:text-gray-200 text-gray-700 transition-colors text-xs">{message.author.name}</span>
		{/if}

		<span class="dark:text-gray-300 text-gray-700 transition-colors text-xs ml-2 flex items-center gap-2">
			{#if isMine && status === EMessageStatuses.WROTE}
				<Clock size={13} class="dark:text-gray-100 text-gray-600 transition-colors" />
			{:else if isMine}
				<div
					title={status.toString()}
					class={clsx('w-6 h-3 rounded-full flex items-center p-[2px] transition-all', {
						'justify-end bg-transparent': status === EMessageStatuses.SENT,
						'justify-end dark:bg-gray-600 bg-gray-300': status === EMessageStatuses.RECEIVED,
						'justify-start bg-purple-500': status === EMessageStatuses.READ,
					})}
				>
					<div class="rounded-full w-2 h-2 bg-white transition-all" />
				</div>
			{/if}

			{timeToShow}
		</span>
	</div>

	<div class={clsx('flex items-center gap-2', { 'flex-row-reverse': isMine })}>
		<div
			class={clsx('w-fit rounded-[12px] text-white font-light text-sm shadow z-[13] p-1 min-w-[100px]', {
				'bg-gray-950 rounded-tl-none': !isMine,
				'bg-purple-500 rounded-tr-none': isMine,
			})}
		>
			{#if message.repliedMessage}
				<div
					class={clsx('dark:bg-black bg-white transition-colors p-2 rounded-[8px] w-full flex flex-col', {
						'ml-auto': isMine,
					})}
				>
					<span class="text-purple-300 text-xs">
						{message.repliedMessage.id}
					</span>

					<span class="text-gray-200 text-sm">
						{message.repliedMessage.content}
					</span>
				</div>
			{/if}
			<p class="p-1">{message.content}</p>
		</div>

		<button
			class="p-2 bg-gray-700 shadow-lg z-10 rounded-full"
			on:click={() => {
				chatDispatch.setReplyMessageFromConversation({ conversationId: message.conversationId, message });
			}}
		>
			<ShareFat size={12} color="white" weight="fill" />
		</button>
	</div>
</li>
