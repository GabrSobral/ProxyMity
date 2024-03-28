<script lang="ts">
   import { scale } from 'svelte/transition';
   import { ChevronDown } from 'lucide-svelte';

   export let container: HTMLUListElement;

   let isVisible = false;

   $: handleScroll = () => {
      if (container) {
         const isScrolledToBottom = container.scrollHeight - container.clientHeight <= container.scrollTop + 1;
         isVisible = !isScrolledToBottom;
      }
   };

   $: if (container) {
      container?.addEventListener('scroll', handleScroll);
   }

   function scrollToBottom() {
      container.scroll({ top: container.scrollHeight, behavior: 'smooth' });
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
