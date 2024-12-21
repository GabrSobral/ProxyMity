<script lang="ts">
	import clsx from 'clsx';
	import { ChevronDown, UsersRound } from 'lucide-svelte';

	import Heading from '$lib/components/ui/heading.svelte';
	import ParticipantsList from './participants-list.svelte';

	import { chatState } from '$lib/modules/chat/contexts/chat-context/stores/chat';

	let isCollapsed = $state(false);
</script>

<section
	class="relative flex h-fit flex-col overflow-hidden rounded-[10px] bg-gray-900 shadow-md transition-all"
>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		role="button"
		tabindex="-1"
		onclick={() => {
			isCollapsed = !isCollapsed;
		}}
	>
		<Heading
			size="sm"
			class="flex w-full cursor-pointer items-center justify-between gap-2 bg-black px-4 py-2 text-white transition-all hover:brightness-90"
		>
			<span class="flex gap-2 text-white transition-colors">
				<UsersRound size={24} className="text-white transition-colors" /> Participants -{' '}
				{$chatState.conversations[$chatState.selectedConversationIndex]?.participants.length}
			</span>

			<ChevronDown
				size={24}
				class={clsx('text-white transition-all', {
					'rotate-180': !isCollapsed
				})}
			/>
		</Heading>
	</div>

	<div
		data-is-collapsed={isCollapsed}
		class={'h-80 max-h-80  overflow-hidden transition-all duration-300 data-[is-collapsed=true]:h-0 data-[is-collapsed=true]:max-h-0'}
	>
		<ParticipantsList />
	</div>

	<div
		data-is-collapsed={isCollapsed}
		class="pointer-events-none absolute bottom-0 z-10 h-10 max-h-10 w-full bg-gradient-to-t from-gray-950 transition-all data-[is-collapsed=true]:max-h-0"
	></div>
</section>
