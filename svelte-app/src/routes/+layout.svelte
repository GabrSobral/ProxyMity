<script>
   import '../app.css';

   import ThemeContext from '../contexts/theme/context.svelte';
   import { setAppThemeContext } from '../contexts/theme/store';

   import { Toaster } from '$lib/components/ui/sonner';

   import '@fontsource-variable/inter';

   setAppThemeContext();
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
