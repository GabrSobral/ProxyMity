<script lang="ts">
   import { Header } from '$lib/application/header';
   import NavigationBar from '$lib/application/navigation-bar/index.svelte';
</script>

<div class="max-h-screen h-screen">
   <Header />

   <div class="flex w-full max-h-[calc(100%-3.75rem)] h-full">
      <NavigationBar />
      <slot />
   </div>
</div>
