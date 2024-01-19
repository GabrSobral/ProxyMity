<script>
   import '../app.css';

   import { setAppThemeContext } from '../contexts/theme/context';
   import { Toaster } from "$lib/components/ui/sonner";

   import '@fontsource-variable/inter';

   setAppThemeContext();
</script>

<Toaster position="bottom-left" closeButton />

<slot />

<style>
   :global(body) {
      font-family: 'Inter Variable', sans-serif;
   }
</style>
