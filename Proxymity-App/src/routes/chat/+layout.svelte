<script lang="ts">
   import { Header } from '$lib/application/Header';

   import NavigationBar from '$lib/application/NavigationBar/index.svelte';
   import ChatContext from '$lib/modules/chat/contexts/chat-context/ChatContext.svelte';
   import WebsocketContext from '$lib/modules/chat/contexts/websocket-context/WebsocketContext.svelte';
</script>

<WebsocketContext>
   <ChatContext>
      <div class="max-h-screen h-screen">
         <Header />

         <div class="flex w-full max-h-[calc(100%-3.75rem)] h-full">
            <NavigationBar />
            <slot />
         </div>
      </div>
   </ChatContext>
</WebsocketContext>
