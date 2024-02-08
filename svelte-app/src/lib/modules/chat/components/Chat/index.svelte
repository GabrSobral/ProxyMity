<script lang="ts">
   import { fade } from 'svelte/transition';

   import ChatHeader from './ChatHeader.svelte';
   import MessagesContainer from './MessagesContainer/index.svelte';
</script>

<section
   class="dark:bg-black bg-gray-200 border border-gray-900 transition-all rounded-[10px] overflow-hidden w-full flex-1 flex flex-col bg-[url('/chat-background.svg')] bg-cover bg-no-repeat"
>
   <ChatHeader />
   <MessagesContainer />
</section>
