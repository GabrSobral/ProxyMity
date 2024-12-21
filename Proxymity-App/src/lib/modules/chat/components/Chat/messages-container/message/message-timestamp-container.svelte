<script lang="ts">
	import { Clock } from 'lucide-svelte';

	import * as Avatar from '$lib/components/ui/avatar';
	import MessageStatus from './message-status.svelte';

	import { EMessageStatuses } from '../../../../../../../enums/EMessageStatuses';
	import type { ILocalMessage } from '../../../../../../../types/message';

	let { message, previousMessage, isMine } = $props<{
		message: ILocalMessage;
		previousMessage: ILocalMessage | null;
		isMine: boolean;
	}>();

	const previousIsFromUser = previousMessage?.author?.id === message.author?.id;
	const formatter = Intl.DateTimeFormat('pt-br', { hour: 'numeric', minute: 'numeric' });
	let timeToShow = $derived(formatter.format(new Date(message.writtenAt)));

	let status: EMessageStatuses = $derived.by(() => {
		if (message.read.byAllAt !== null) return EMessageStatuses.READ;
		if (message.received.byAllAt !== null) return EMessageStatuses.RECEIVED;
		if (message.sentAt !== null) return EMessageStatuses.SENT;

		return EMessageStatuses.WROTE;
	});
</script>

<div
	data-is-mine={isMine}
	class="sticky -top-3 z-20 flex w-fit items-center gap-3 rounded-full bg-primary p-1 px-2 transition-colors data-[is-mine=true]:ml-auto"
>
	{#if !isMine && !previousIsFromUser}
		<Avatar.Root class="h-7 w-7">
			<Avatar.Image src="https://github.com/shadcn.png" />
		</Avatar.Root>

		<span class="text-xs text-accent transition-colors">{message.author.name}</span>
	{/if}

	<span class="flex items-center gap-2 text-xs text-secondary transition-colors">
		{#if isMine && status === EMessageStatuses.WROTE}
			<Clock size={13} class="text-gray-100 transition-colors" />
		{:else if isMine}
			<MessageStatus {status} />
		{/if}

		{timeToShow}
	</span>
</div>
