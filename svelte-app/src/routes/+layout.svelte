<script>
   import '../app.css';

   import ThemeContext from '../contexts/theme/context.svelte';

   import { Toaster } from '$lib/components/ui/sonner';

   import '@fontsource-variable/inter';
</script>

<ThemeContext>
   <Toaster position="bottom-left" closeButton />

   <slot />
</ThemeContext>

<style>
   :global(body) {
      font-family: 'Inter Variable', sans-serif;
   }
</style>
