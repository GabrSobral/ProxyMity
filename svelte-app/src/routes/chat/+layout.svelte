<script lang="ts">
	import { Header } from '$lib/application/Header';
	import ChatContext from '$lib/modules/chat/contexts/chat-context/ChatContext.svelte';
</script>

<ChatContext>
	<Header />
	<slot />
</ChatContext>
