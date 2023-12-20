<script lang="ts">
	import Chat from '../components/Chat/index.svelte';
	import ChatsSidebar from '../components/ChatsSidebar/index.svelte';

	import { chatState } from '../contexts/chat-context/stores/chat';

	$: console.log({ state: $chatState });
</script>

<main class="flex flex-1 p-4 h-full gap-4 overflow-hidden m-auto max-w-[1980px] w-full">
	<ChatsSidebar />

	{#if $chatState.selectedConversation}
		<Chat />
	{/if}

	<!-- <ConversationDetail />  -->
</main>
