<script lang="ts" context="module">
   export type InputContextProps = {
      inputId: string;
      hasError: boolean;
   };
</script>

<script lang="ts">
   import { setContext } from 'svelte';
   import { twMerge } from 'tailwind-merge';

   import Label from './Label.svelte';
   import Wrapper from './Wrapper.svelte';
   import InputComponent from './Input.svelte';
   import ErrorMessage from './ErrorMessage.svelte';

   let { class: className = '', ...rest } = $props();

   let context = $state<InputContextProps>({
      inputId: crypto.getRandomValues(new Uint32Array(10)).toString(),
      hasError: false,
   });

   const components = {
      Input: InputComponent,
      Label,
      Wrapper,
      ErrorMessage,
   };

   setContext<InputContextProps>('@design-system:inputContext', context);
</script>

<!-- svelte-ignore slot_element_deprecated -->
<div class={twMerge('flex flex-col gap-2 w-full', className)} {...rest}>
   <slot {...components} />
</div>
