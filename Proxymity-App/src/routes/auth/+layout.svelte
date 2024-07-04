<script lang="ts">
   let { children } = $props();
</script>

<main
   class="flex-1 flex-col gap-4 flex items-center justify-center bg-[url('/sign-background.svg')] bg-no-repeat bg-cover relative bg-black"
>
   <div
      class="p-4 duration-300 rounded-[1rem] mt-12 ring-1 ring-gray-700 w-96 flex flex-col gap-4 shadow-lg bg-gray-800/40 backdrop-blur-sm transition-all max-h-full"
   >
      <header class="flex items-center justify-center relative h-[80px]">
         <img src="/Logo.svg" alt="ProxyMity Logo" width={170} height={170} class="absolute -top-[5rem]" />
      </header>

      {@render children()}
   </div>

   <span class="text-gray-200">© {new Date().getFullYear()} ProxyMity. All rights reserved.</span>
</main>
