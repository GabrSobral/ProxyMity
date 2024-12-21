<script lang="ts">
   import { Menu } from 'lucide-svelte';
   import MessagesContainer from '../../../chat/components/chat/messages-container/index.svelte';

   import Text from '$lib/components/ui/text.svelte';
</script>

<aside
   class="bg-slate-900/40 backdrop-blur-md h-full max-h-[calc(100vh-1rem)] w-[30rem] shadow-lg rounded-lg overflow-hidden flex flex-col"
>
   <header class="flex p-4 border-b border-b-gray-700 gap-4 bg-black">
      <img src="https://github.com/GabrSobral.png" alt="" class="rounded-full w-[2.5rem] h-[2.5rem] shadow-lg" />

      <div class="flex flex-col">
         <Text size="lg">Gabriel Sobral</Text>
         <Text size="sm">gabriel.sobral1367@gmail.com</Text>
      </div>

      <button type="button" title="Details" class="ml-auto">
         <Menu class="text-white" size={28} />
      </button>
   </header>

   <MessagesContainer />
</aside>
