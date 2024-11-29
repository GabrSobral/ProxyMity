<script lang="ts" context="module">
   export interface IDropdownContext {
      isPanelOpened: Writable<boolean>;
      triggerId: string;
   }
</script>

<script lang="ts">
   import { setContext } from 'svelte';
   import { writable, type Writable } from 'svelte/store';
   import { clickOutside } from '../dialog/click-outside';

   let isPanelOpened = writable(false);
   let triggerId = crypto.randomUUID();

   setContext<IDropdownContext>('dropdown-context', {
      isPanelOpened,
      triggerId,
   });
</script>

<div class="relative" use:clickOutside on:click_outside={() => isPanelOpened.set(false)}>
   <slot />
</div>
