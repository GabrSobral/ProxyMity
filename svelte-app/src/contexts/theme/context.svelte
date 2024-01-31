<script lang="ts">
   import { onMount } from 'svelte';
   import { appTheme, localStorageKeyName, type ITheme } from './store';

   onMount(() => {
      const storedTheme = localStorage.getItem(localStorageKeyName);

      if (storedTheme) {
         appTheme.set(storedTheme as ITheme);

         if (storedTheme === 'system') {
            const darkThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            document.documentElement.setAttribute('class', darkThemeMediaQuery.matches ? 'dark' : 'light');

            return;
         }
      }

      document.documentElement.setAttribute('class', storedTheme || $appTheme);
   });
</script>

<slot><!-- optional fallback --></slot>
