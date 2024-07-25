<script lang="ts">
   import { X, AlertCircle } from 'lucide-svelte';

   export let errorMessage: string;
   export let closeAlert: () => void;
</script>

<div class="w-full bg-red-600 p-2 px-3 rounded-[10px] mb-3 flex gap-2 items-center">
   <AlertCircle size={24} class="text-white" />

   <span class="tracking-wide text-white text-sm">{errorMessage}</span>

   <button type="button" on:click={closeAlert} class="ml-auto" title="Close warning">
      <X size={24} class="text-white" />
   </button>
</div>
