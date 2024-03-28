<script lang="ts">
   import { getContext } from 'svelte';
   import type { HTMLButtonAttributes } from 'svelte/elements';

   import type { ButtonEvents } from '../button';
   import type { IDropdownContext } from './dropdown-root.svelte';

   type $$Props = HTMLButtonAttributes;
   type $$Events = ButtonEvents;

   let { isPanelOpened, triggerId } = getContext<IDropdownContext>('dropdown-context');
</script>

<button type="button" on:click={() => isPanelOpened.update(state => !state)} id={triggerId} {...$$restProps}>
   <slot />
</button>
