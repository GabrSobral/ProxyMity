<script lang="ts">
	import { page } from '$app/stores';
	import { User } from 'lucide-svelte';

	import Text from '$lib/components/ui/text.svelte';
	import { chatState } from '$lib/modules/chat/contexts/chat-context/stores/chat';

	let user = $derived($page.data.session?.user);
</script>

<ul class="flex flex-col gap-1 overflow-y-scroll p-1 transition-all">
	{#each $chatState.conversations[$chatState.selectedConversationIndex]?.participants || [] as participant (participant.id)}
		<li
			class="group relative flex w-full gap-4 rounded-[6px] bg-gray-800 px-3 py-2 shadow transition-colors hover:opacity-90"
		>
			<div class="relative max-h-[40px] min-h-[40px] min-w-[40px] max-w-[40px]">
				<div
					class="z-0 flex max-h-[40px] min-h-[40px] min-w-[40px] max-w-[40px] items-center justify-center rounded-full bg-gray-700 shadow-xl"
				>
					<User size={20} class="text-white" />
				</div>
			</div>

			<div class="z-10 flex w-full flex-col gap-1 overflow-hidden">
				<Text size="md" class={`flex items-center justify-between gap-3 truncate font-medium`}>
					{participant.firstName}
					{participant.id === user?.id ? '(You)' : ''}
					<span class="ml-auto text-[12px] text-green-400">Online</span>
				</Text>

				<div class={'flex justify-between gap-4 truncate text-sm text-gray-200'}>
					<Text size="sm" class="text-gray-400">
						{participant.email}
					</Text>
				</div>
			</div>
		</li>
	{/each}
</ul>
