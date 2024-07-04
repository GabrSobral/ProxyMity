<script lang="ts">
   import { signIn } from '@auth/sveltekit/client';

   import { page } from '$app/stores';
   import { goto } from '$app/navigation';

   let { children } = $props();
</script>

<div class="overflow-hidden p-1 flex items-center justify-center flex-1 flex-col">
   {@render children()}
</div>
