<script lang="ts">
   import Toaster from '$lib/design-system/toaster/toaster.svelte';
   import '../app.css';

   import ThemeContext from '../contexts/theme/context.svelte';

   import '@fontsource-variable/inter';

   import ChatContext from '$lib/modules/chat/contexts/chat-context/chat-context.svelte';
   import WebsocketContext from '$lib/modules/chat/contexts/websocket-context/websocket-context.svelte';
   import CallContext from '$lib/modules/chat/contexts/call-context/call-context.svelte';

   let { children } = $props();
</script>

<ThemeContext>
   <WebsocketContext>
      <ChatContext>
         <!-- <CallContext> -->
         <Toaster position="bottom-left" closeButton />

         {@render children()}
         <!-- </CallContext> -->
      </ChatContext>
   </WebsocketContext>
</ThemeContext>

<style>
   :global(body) {
      font-family: 'Inter Variable', sans-serif;
   }
</style>
