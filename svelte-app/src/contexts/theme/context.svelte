<script lang="ts">
   import { onMount } from 'svelte';
   import {
      appTheme,
      localStorageThemeKeyName,
      localStorageAppColorKeyName,
      type ITheme,
      appColor,
      type IAppColor,
   } from './store';

   onMount(() => {
      const storedTheme = localStorage.getItem(localStorageThemeKeyName) as ITheme | null;
      const storedAppColor = localStorage.getItem(localStorageAppColorKeyName) as IAppColor | null;

      appColor.set(storedAppColor || 'purple');

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
