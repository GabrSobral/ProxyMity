<script lang="ts">
   import Toaster from '$lib/design-system/toaster/toaster.svelte';
   import '../app.css';

   import ThemeContext from '../contexts/theme/context.svelte';

   import '@fontsource-variable/inter';

   import ChatContext from '$lib/modules/chat/contexts/chat-context/chat-context.svelte';
   import WebsocketContext from '$lib/modules/chat/contexts/websocket-context/websocket-context.svelte';

   let { children } = $props();
</script>

<ThemeContext>
   <WebsocketContext>
      <ChatContext>
         <Toaster position="bottom-left" closeButton />

         {@render children()}
      </ChatContext>
   </WebsocketContext>
</ThemeContext>

<style>
   :global(body) {
      font-family: 'Inter Variable', sans-serif;
   }
</style>
