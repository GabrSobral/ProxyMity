<script lang="ts">
	import ChatHeader from './chat-header.svelte';
	import MessagesContainer from './messages-container/index.svelte';
</script>

<section class="flex w-full flex-1 flex-col overflow-hidden transition-all">
	<ChatHeader />
	<MessagesContainer />
</section>
