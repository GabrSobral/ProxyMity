<script lang="ts">
   import { afterUpdate, onMount } from 'svelte';
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
      type="button"
      title="Scroll to bottom"
      on:click|stopPropagation={scrollToBottom}
      class="absolute bottom-24 right-8 z-20 flex items-center justify-center bg-purple-400 outline-none focus:outline-purple-500 focus:ring-0 rounded-full min-w-[2rem] min-h-[2rem] max-w-[2rem] max-h-[2rem] mt-auto ml-auto p-2"
   >
      <ChevronDown class="text-white" />
   </button>
{/if}
