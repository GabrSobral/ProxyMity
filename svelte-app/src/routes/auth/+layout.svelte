<script lang="ts">
   import { page } from '$app/stores';
   import { afterUpdate } from 'svelte';
   import { Laptop, Moon, Sun } from 'lucide-svelte';

   import LoadingSpinning from '$lib/design-system/LoadingSpinning.svelte';

   import { getAppThemeContext } from '../../contexts/theme/context';

   const appTheme = getAppThemeContext();

   let isSignInPage = $page.url.pathname.includes('sign-in');

   afterUpdate(() => {
      isSignInPage = $page.url.pathname.includes('sign-in');
   });
</script>

<main class="flex-1 flex items-center justify-center bg-[url('/sign-background.svg')] bg-no-repeat bg-cover relative">
   <div class="flex gap-4 absolute top-4 left-4">
      <button
         type="button"
         title="Set to Light Theme"
         tabindex="-2"
         on:click={() => appTheme.set('light')}
         aria-label="Set to Light Theme"
         data-is-active={$appTheme === 'light'}
         class="data-[is-active=true]:ring-purple-500 ring-0 data-[is-active=true]:ring-2 rounded-full p-3 bg-white w-[46px] h-[46px] min-w-[46px] min-h-[46px] transition-all hover:brightness-75 flex items-center justify-center shadow-lg"
      >
         <Sun class="text-gray-700" size={24} />
      </button>

      <button
         type="button"
         title="Set to Dark Theme"
         tabindex="-2"
         on:click={() => appTheme.set('dark')}
         aria-label="Set to Dark Theme"
         data-is-active={$appTheme === 'dark'}
         class="data-[is-active=true]:ring-purple-500 ring-0 data-[is-active=true]:ring-2 rounded-full p-3 bg-gray-800 w-[46px] h-[46px] min-w-[46px] min-h-[46px] transition-all hover:brightness-75 flex items-center justify-center shadow-lg"
      >
         <Moon class="text-white" size={24} />
      </button>

      <button
         type="button"
         tabindex="-2"
         title="Set to System Theme"
         on:click={() => appTheme.set('system')}
         aria-label="Set to System Theme"
         data-is-active={$appTheme === 'system'}
         class="data-[is-active=true]:ring-purple-500 ring-0 data-[is-active=true]:ring-2 dark:border-gray-700 rounded-full p-3 bg-transparent w-[46px] h-[46px] min-w-[46px] min-h-[46px] transition-all hover:brightness-75 flex items-center justify-center shadow-lg"
      >
         <Laptop class="text-white transition-colors" size={24} />
      </button>
   </div>

   <div
      class="p-4 duration-300 rounded-[1rem] ring-1 dark:ring-gray-700 ring-gray-300 w-96 flex flex-col gap-4 shadow-lg dark:bg-gray-800/40 bg-white/20 backdrop-blur-sm transition-all max-h-full"
   >
      <header class="flex items-center justify-center relative h-[80px]">
         <img src="/Logo.svg" alt="ProxyMity Logo" width={170} height={170} class="absolute -top-[5rem]" />
      </header>

      <div class="flex w-full dark:bg-gray-900 bg-gray-200/20 relative rounded-full shadow-inner transition-colors">
         <div
            data-signin={isSignInPage}
            data-signup={!isSignInPage}
            class="absolute h-[80%] -translate-y-2/4 top-2/4 w-[calc(50%-12px)] rounded-full z-20 gradient transition-all shadow-lg duration-300 data-[signin=true]:left-[6px] data-[signup=true]:left-[calc(50%+6px)]"
         />

         <a
            tabindex="-1"
            href="/auth/sign-in"
            title="Log In Page"
            data-sveltekit-preload-data="hover"
            class="flex items-center flex-1 text-white font-medium text-lg whitespace-nowrap p-3 rounded-[10px] justify-center z-30 tracking-widest"
         >
            Log In
         </a>

         <a
            tabindex="-1"
            href="/auth/sign-up"
            title="Register page"
            data-sveltekit-preload-data="hover"
            class="flex items-center flex-1 text-white font-medium text-lg whitespace-nowrap p-3 rounded-[10px] justify-center z-30 tracking-widest"
         >
            Register
         </a>
      </div>

      <div class="overflow-hidden p-1 flex items-center justify-center flex-1 flex-col">
         <slot>
            <LoadingSpinning />
         </slot>
      </div>
   </div>
</main>
