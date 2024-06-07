<script>
   import Profile from './profile.svelte';
</script>

<header class="bg-black min-h-[60px] border-b border-solid border-gray-900 flex items-center w-full transition-colors">
   <div class="max-w-[1980px] flex items-center gap-8 px-6 m-auto w-full">
      <img src="/horizontal-logo.svg" alt="ProxyMity Logo" width={136} />

      <div class="flex items-center gap-4 ml-auto">
         <!-- <NotificationButton /> -->
      </div>

      <Profile />
   </div>
</header>
