<script lang="ts">
	import Heading from '$lib/design-system/Heading.svelte';
	import Typebar from './Typebar.svelte';

	let conversationMessages: any[] = [];
</script>

<div class="overflow-hidden w-full flex-1 h-full flex flex-col p-1 relative">
	<ul class="flex flex-col gap-2 overflow-auto p-4">
		{#if conversationMessages?.length === 0}
			<div class="flex-1 flex items-center justify-center flex-col gap-3 pointer-events-none">
				<img src="/no-messages.svg" alt="No message" class="w-[25rem]" />
				<Heading size="sm" className="opacity-80">No messages have been sent yet...</Heading>
			</div>
		{:else}
			{#each conversationMessages as message (message.id)}
				<Message {message} previousMessage={conversationMessages?.[i - 1]} />
			{/each}
		{/if}
		conversationMessages?.map((message, i) => ( ))
	</ul>

	<Typebar />
</div>
