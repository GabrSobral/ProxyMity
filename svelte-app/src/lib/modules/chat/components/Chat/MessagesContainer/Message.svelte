<script lang="ts">
	import clsx from 'clsx';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { Clock, ShareFat } from 'phosphor-svelte';

	import { chatDispatch } from '$lib/modules/chat/contexts/chat-context/stores/chat';

	import type { Message } from '../../../../../../types/message';
	import { EMessageStatuses } from '../../../../../../enums/EMessageStatuses';
	import { changeMessageStatusAsyncDB } from '../../../../../../services/database/use-cases/change-message-status';

	export let message: Message;
	export let previousMessage: Message;

	let isMessageConfigVisible = false;
	let status: EMessageStatuses = (() => {
		if (message.readByAllAt !== null) return EMessageStatuses.READ;
		if (message.receivedByAllAt !== null) return EMessageStatuses.RECEIVED;
		if (message.sentAt !== null) return EMessageStatuses.SENT;

		return EMessageStatuses.WROTE;
	})();

	$: user = $page.data.session?.user;

	const formatter = Intl.DateTimeFormat('pt-br', { hour: 'numeric', minute: 'numeric' });

	const selectTimeToShow = (isMine: boolean, message: Message) =>
		isMine
			? formatter.format(new Date(message.writtenAt))
			: message.receivedByAllAt && new Date(message.receivedByAllAt) !== null
				? formatter.format(new Date(message.receivedByAllAt))
				: null;

	$: isMine = message.authorId === user?.id;
	const previousIsFromUser = previousMessage?.authorId === message.authorId;

	const timeToShow = selectTimeToShow(isMine, message);

	onMount(() => {
		function handler(
			event: CustomEventInit<{
				messageStatus: EMessageStatuses.SENT | EMessageStatuses.RECEIVED;
				messageId: string;
				conversationId: string;
			}>
		) {
			if (!event.detail) {
				return;
			}

			const { messageId, messageStatus, conversationId } = event.detail;

			if (messageStatus && messageId && conversationId) {
				status = messageStatus;
				chatDispatch.updateConversationMessageStatus({ conversationId, messageId: message.id, status: messageStatus });
				changeMessageStatusAsyncDB({ messageId: messageId, status: messageStatus });
			}
		}

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
			<span class="dark:text-gray-200 text-gray-700 transition-colors text-xs">Diego</span>
		{/if}

		<span class="dark:text-gray-300 text-gray-700 transition-colors text-xs ml-2 flex items-center gap-2">
			{#if isMine && status === EMessageStatuses.WROTE}
				<Clock size={13} class="dark:text-gray-100 text-gray-600 transition-colors" />
			{:else}
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
			{#if message.repliedMessageId}
				<div
					class={clsx('dark:bg-black bg-white transition-colors p-2 rounded-[8px] w-full flex flex-col', {
						'ml-auto': isMine,
					})}
				>
					<span class="text-purple-300 text-xs">
						{message.repliedMessageId}
					</span>

					<span class="text-gray-200 text-sm">
						{message.repliedMessageId}
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
