<script lang="ts">
   import ChatHeader from './chat-header.svelte';
   import MessagesContainer from './messages-container/index.svelte';
</script>

<section class="backdrop-blur-md transition-all overflow-hidden w-full flex-1 flex flex-col">
   <ChatHeader />
   <MessagesContainer />
</section>
