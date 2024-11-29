<script lang="ts">
   import NavigationBar from '$lib/application/navigation-bar/index.svelte';

   let { children } = $props();
</script>

<div class="max-h-screen h-screen">
   <div class="flex w-full max-h-[100%] h-full">
      <NavigationBar />

      {@render children()}
   </div>
</div>
