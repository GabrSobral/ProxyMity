<script lang="ts">
   import { scale } from 'svelte/transition';
   import { ChevronDown } from 'lucide-svelte';

   import { messagesContainer } from '$lib/modules/chat/contexts/chat-context/stores/chat';

   let isVisible = false;

   $: handleScroll = () => {
      if ($messagesContainer) {
         const isScrolledToBottom =
            $messagesContainer.scrollHeight - $messagesContainer.clientHeight <= $messagesContainer.scrollTop + 1;
         isVisible = !isScrolledToBottom;
      }
   };

   $: if ($messagesContainer) {
      $messagesContainer?.addEventListener('scroll', handleScroll);
   }

   function scrollToBottom() {
      $messagesContainer?.scroll({ top: $messagesContainer.scrollHeight, behavior: 'smooth' });
   }
</script>

{#if isVisible}
   <button
      transition:scale={{ duration: 300, start: 0, opacity: 0.5 }}
      type="button"
      title="Scroll to bottom"
      on:click|stopPropagation={scrollToBottom}
      class="absolute bottom-24 right-8 z-20 flex items-center justify-center bg-purple-400 outline-none focus:outline-purple-500 focus:ring-0 rounded-full min-w-[1.75rem] min-h-[1.75rem] max-w-[1.75rem] max-h-[1.75rem] mt-auto ml-auto p-1"
   >
      <ChevronDown class="text-white" />
   </button>
{/if}
