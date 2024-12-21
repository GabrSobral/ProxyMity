<script lang="ts">
	import { chatState } from '../../contexts/chat-context/stores/chat';
	import ChatDetailHeader from './chat-detail-header.svelte';
	import ParticipantsContainer from './participants-container/index.svelte';
</script>

{#if $chatState.conversations[$chatState.selectedConversationIndex] && $chatState.showConversationDetail}
	<aside class="flex h-full w-[280px] flex-col gap-4 bg-background p-2">
		<ChatDetailHeader />

		{#if $chatState.conversations[$chatState.selectedConversationIndex].isGroup}
			<ParticipantsContainer />
		{/if}
	</aside>
{/if}
