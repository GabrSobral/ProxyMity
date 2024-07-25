<script lang="ts">
   import { twMerge } from 'tailwind-merge';

   let { children, className, isRequired, ...rest }: { children: any; className?: string; isRequired: boolean } = $props();
</script>

<label for="" class={twMerge('text-gray-200 font-medium', className)} {...rest}>
   {@render children()}

   {#if isRequired}
      <span class="text-red-500" title="Field required">*</span>
   {/if}
</label>
