<script lang="ts">
   import Text from '../Text.svelte';
   import { cn } from '$lib/utils';

   let className: HTMLDivElement['className'] | undefined = undefined;

   export { className as class };
</script>

<Text tag="p" size="md" class={cn('dark:text-gray-200', className)}>
   <slot>Dialog description</slot>
</Text>
