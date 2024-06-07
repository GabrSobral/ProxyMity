<script lang="ts">
   import { getContext, onMount } from 'svelte';

   import { flyAndScale } from '$lib/utils';
   import type { IDropdownContext } from './dropdown-root.svelte';

   let { isPanelOpened, triggerId } = getContext<IDropdownContext>('dropdown-context');
   let triggerElement: HTMLElement | null;
   let panelELement: HTMLElement | null;

   $: triggerRect = triggerElement?.getBoundingClientRect();
   $: panelRect = panelELement?.getBoundingClientRect();

   let windowWidth = 0;

   $: yAxis = (triggerRect?.y || 0) + (triggerRect?.height || 0);
   $: xAxis = (triggerRect?.width || 0) - (panelRect?.width || 0);

   onMount(() => {
      triggerElement = document.getElementById(triggerId);
      windowWidth = window.screen.width;
   });

   $: if ($isPanelOpened) panelELement?.focus();
</script>

{#if $isPanelOpened}
   <div
      transition:flyAndScale={{ start: 1, x: 0, y: -10 }}
      bind:this={panelELement}
      class={`absolute rounded-[8px] z-10 border border-[#303030] bg-gradient-to-br from-[#136DCE]/50 via-[22%] via-black/20 backdrop-blur p-1 shadow-lg flex flex-col gap-1 w-fit whitespace-nowrap`}
      style="top: {yAxis}px; left: {xAxis}px;"
   >
      <slot />
   </div>
{/if}
