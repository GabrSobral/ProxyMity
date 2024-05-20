<script lang="ts">
   import { cn } from '$lib/utils';
   import type { HTMLButtonAttributes } from 'svelte/elements';
   import type { ButtonEvents } from '.';

   type $$Events = ButtonEvents;

   type InternalProps = {
      class?: string;
      isOutlined?: boolean;
   };

   const { isOutlined = false, class: className = '', children, ...rest }: HTMLButtonAttributes & InternalProps = $props();
</script>

<button
   class={cn(
      'disabled:cursor-not-allowed disabled:opacity-40 min-h-[38px] border-2 border-solid h-fit w-fit whitespace-nowrap px-4 py-[0.375rem] rounded-md flex gap-2 items-center justify-center font-semibold hover:brightness-90 transition-all outline-none focus:outline-purple-500 focus:ring-0',
      {
         'border-purple-500 text-white bg-gradient-to-r from-[#B809A6] border-0 to-[#1C64CE]': !isOutlined,
         'border-gray-700 text-gray-200 bg-transparent': isOutlined,
      },
      className
   )}
   {...rest}
>
   {@render children()}
</button>
