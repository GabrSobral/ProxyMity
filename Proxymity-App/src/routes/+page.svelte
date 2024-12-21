<script lang="ts">
	import MainPage from '$lib/modules/chat/components/chat/index.svelte';
	import ChatDetail from '$lib/modules/chat/components/chat-details/index.svelte';
	import ChatsList from '$lib/modules/chat/components/chats-sidebar/index.svelte';
	import { chatState } from '$lib/modules/chat/contexts/chat-context/stores/chat';
	import ChatContext from '$lib/modules/chat/contexts/chat-context/chat-context.svelte';
	import NoChatSelected from '$lib/modules/chat/components/chat/no-chat-selected.svelte';
</script>

<svelte:head>
	<title>Chat - ProxyMity</title>
</svelte:head>

<ChatContext>
	<div class="h-screen max-h-screen">
		<div class=" flex h-full max-h-[100%] w-full flex-1 overflow-hidden">
			<ChatsList />

			<div
				class="relative flex h-full max-h-[100%] flex-1 bg-gradient-to-br from-[#136DCE]/30 via-[52%] to-purple-500/30"
			>
				<div
					class="absolute -z-10 h-full max-h-[100%] w-full flex-1 overflow-hidden bg-[url('/chat-background.svg')] opacity-30"
				></div>

				{#if $chatState.conversations[$chatState.selectedConversationIndex]}
					<MainPage />
					<ChatDetail />
				{:else}
					<NoChatSelected />
				{/if}
			</div>
		</div>
	</div>
</ChatContext>
