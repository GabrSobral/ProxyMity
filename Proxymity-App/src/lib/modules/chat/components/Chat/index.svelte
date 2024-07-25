<script lang="ts">
   import ChatHeader from './chat-header.svelte';
   import MessagesContainer from './messages-container/index.svelte';
</script>

<section
   class="bg-black border border-gray-900 transition-all rounded-[10px] overflow-hidden w-full flex-1 flex flex-col bg-[url('/chat-background.svg')] bg-cover bg-no-repeat"
>
   <ChatHeader />
   <MessagesContainer />
</section>
