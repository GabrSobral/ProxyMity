<script lang="ts">
	import clsx from 'clsx';
	import type { ILocalMessage } from '../../../../../../../types/message';

	let { message, isMine }: { message: ILocalMessage; isMine: boolean } = $props();

	function scrollToRepliedMessage() {
		if (message.repliedMessage) {
			document.getElementById(message.repliedMessage.id)?.scrollIntoView({ block: 'center' });

			const messageEvent = new CustomEvent(message.repliedMessage.id, {
				detail: { type: 'highlight', messageId: message.id }
			});

			dispatchEvent(messageEvent);
		}
	}
</script>

<button
	type="button"
	title="Show replied message on chat"
	onclick={scrollToRepliedMessage}
	class={clsx(
		'flex w-full cursor-pointer flex-col items-start gap-1 truncate rounded-[8px] p-2 transition-colors',
		{
			'bg-background': isMine,
			'bg-primary': !isMine
		}
	)}
>
	<span class="w-full truncate break-words text-start text-xs text-purple-300 dark:text-purple-500">
		{message.author.name}
	</span>
	<span
		class={clsx('line-clamp-2 flex w-full truncate break-words text-start text-sm', {
			'text-accent': !isMine,
			'text-primary': isMine
		})}
	>
		{message.repliedMessage?.content}
	</span>
</button>
