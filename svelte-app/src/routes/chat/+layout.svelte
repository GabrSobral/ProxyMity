<script lang="ts">
   import { Header } from '$lib/application/Header';

   import ChatContext from '$lib/modules/chat/contexts/chat-context/ChatContext.svelte';
   import WebsocketContext from '$lib/modules/chat/contexts/websocket-context/WebsocketContext.svelte';
</script>

<WebsocketContext>
   <ChatContext>
      <Header />
      <slot />
   </ChatContext>
</WebsocketContext>
