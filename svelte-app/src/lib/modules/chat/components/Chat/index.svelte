<script lang="ts">
	import { fade } from 'svelte/transition';

	import ChatHeader from './ChatHeader.svelte';
	import MessagesContainer from './MessagesContainer/index.svelte';
</script>

<section
	transition:fade={{ duration: 180 }}
	class="dark:bg-gray-900 bg-gray-200 transition-all rounded-[10px] overflow-hidden w-full flex-1 flex flex-col bg-[url('/chat-background.svg')] bg-cover bg-no-repeat"
>
	<ChatHeader />
	<MessagesContainer />
</section>
