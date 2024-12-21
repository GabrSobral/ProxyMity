<script lang="ts">
	import { page } from '$app/stores';
	import { Clock, Pin } from 'lucide-svelte';

	import { cn } from '$lib/utils';

	import * as Avatar from '$lib/components/ui/avatar';

	import { chatState } from '$lib/modules/chat/contexts/chat-context/stores/chat';
	import { selectConversationAsync } from '$lib/modules/chat/contexts/chat-context/chat-context.svelte';
	import type { ConversationState } from '$lib/modules/chat/contexts/chat-context/stores/chat-store-types';

	import IsTyping from './is-typing.svelte';
	import MessageStatus from '../../chat/messages-container/message/message-status.svelte';

	import { EMessageStatuses } from '../../../../../../enums/EMessageStatuses';

	type Props = { conversation: ConversationState; conversationIndex: number };
	let { conversation, conversationIndex }: Props = $props();

	let user = $derived($page.data.session?.user);
	let lastMessage = $derived($chatState.conversations[conversationIndex].messages?.at(-1));

	let isSelectedContact = $derived(
		$chatState.conversations[$chatState.selectedConversationIndex]?.id ===
			$chatState.conversations[conversationIndex].id
	);
	let isMine = $derived(lastMessage?.author?.id === user?.id);
	let draft = $derived($chatState.conversations[conversationIndex].typeMessage);
	let status = $derived.by(() => {
		let lastMessageScoped = $chatState.conversations[conversationIndex].messages?.at(-1);

		if (!lastMessageScoped) {
			return;
		}

		if (lastMessageScoped.read.byAllAt !== null) return EMessageStatuses.READ;
		if (lastMessageScoped.received.byAllAt !== null) return EMessageStatuses.RECEIVED;
		if (lastMessageScoped.sentAt !== null) return EMessageStatuses.SENT;

		return EMessageStatuses.WROTE;
	});

	const formatLastMessageDate = Intl.DateTimeFormat('pt-br', {
		hour: 'numeric',
		minute: 'numeric'
	});
	const conversationName =
		conversation?.groupName ||
		conversation?.participants.find((item) => item.id !== user?.id)?.firstName ||
		'';
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	role="button"
	tabindex="0"
	class="border-1 group relative flex w-full cursor-pointer gap-4 rounded-md border border-secondary bg-background px-3 py-[0.4rem] shadow-sm transition-all hover:opacity-90 hover:brightness-90"
	onclick={() => selectConversationAsync(conversation)}
>
	<div
		aria-hidden="true"
		class={`${
			isSelectedContact ? 'left-0 w-full opacity-100' : 'left-2/4 w-0 opacity-10'
		} duration-[0.3s] absolute top-0 z-0 mx-auto h-full items-center rounded-md bg-purple-500 transition-all`}
	></div>

	<Avatar.Root>
		<Avatar.Image src="https://github.com/shadcn.png" />
	</Avatar.Root>

	<div class={'z-10 flex w-full flex-col overflow-hidden'}>
		<span
			class={`${
				isSelectedContact ? 'text-white' : 'text-foreground'
			} flex items-center justify-between gap-3 truncate font-medium `}
		>
			{conversationName}

			{#if $chatState.conversations[conversationIndex].id === user?.id}
				(You)
			{/if}

			{#if lastMessage}
				<span
					class={`ml-auto text-[12px] text-foreground transition-colors data-[is-selected=true]:text-white`}
					data-is-selected={isSelectedContact}
				>
					{formatLastMessageDate.format(new Date(lastMessage.writtenAt))}
				</span>
			{/if}

			{#if $chatState.conversations[conversationIndex].conversationPinnedAt}
				<Pin
					size="16"
					class={cn('text-foreground transition-colors', { 'text-white': isSelectedContact })}
				/>
			{/if}
		</span>

		<div
			class={cn('flex max-w-[17rem] justify-between gap-4 truncate text-sm text-gray-200', {
				'text-purple-500':
					$chatState.conversations[conversationIndex].typing.length > 0 && !isSelectedContact,
				'text-white': isSelectedContact
			})}
		>
			{#if $chatState.conversations[conversationIndex].typing.length > 0}
				<IsTyping {isSelectedContact} />
			{:else if lastMessage && !draft}
				<span
					class={`flex w-full gap-4 truncate ${isSelectedContact ? 'text-white' : 'text-foreground'}`}
				>
					{lastMessage.content}

					<span class="ml-auto flex items-center gap-2 text-primary">
						{#if isMine && status === EMessageStatuses.WROTE}
							<Clock size={13} />
						{:else if isMine && status !== undefined}
							<MessageStatus {status} />
						{/if}
					</span>
				</span>
			{:else if draft && !isSelectedContact}
				<span class="truncate text-gray-300" title={draft}>Draft: {draft}</span>
			{:else}
				<span>Start the conversation...</span>
			{/if}

			{#if $chatState.conversations[conversationIndex].notifications > 0}
				<span
					class="z-10 ml-auto flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-purple-500 text-[12px] font-medium text-white shadow-[0_0_30px] shadow-purple-500"
				>
					{$chatState.conversations[conversationIndex].notifications}
				</span>
			{/if}
		</div>
	</div>
</div>
