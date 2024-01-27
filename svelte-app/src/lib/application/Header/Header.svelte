<script>
   import Routes from './Routes.svelte';
   import Profile from './Profile.svelte';
   import NotificationButton from './NotificationButton.svelte';

   import { getAppThemeContext } from '../../../contexts/theme/context';

   const appTheme = getAppThemeContext();
</script>

<header
   class="dark:bg-black bg-gray-100 min-h-[70px] border-b border-solid dark:border-gray-900 border-gray-200 flex items-center w-full transition-colors"
>
   <div class="max-w-[1980px] flex items-center gap-8 px-6 m-auto w-full">
      <img src="/horizontal-logo.svg" alt="ProxyMity Logo" width={166} height={49} />

      <Routes />

      <div class="flex items-center gap-4 ml-auto">
         <!-- <NotificationButton /> -->
      </div>

      <Profile />
   </div>
</header>
