<script lang="ts">
   import { MessageSquareText } from 'lucide-svelte';
</script>

<aside class="h-full w-fit flex flex-col py-2 px-1 border-r-gray-800 border-r">
   <nav class="h-full flex flex-col">
      <a href="/chat" class="relative p-2 rounded-sm bg-purple-500 hover:bg-purple-400 transition-all group" title="Chats page">
         <MessageSquareText class="text-white" size={24} strokeWidth={2} />

         <span
            class="absolute group-hover:bg-purple-400/40 text-purple-400 max-w-0 top-2/4 -translate-y-2/4 group-hover:max-w-[15rem] transition-all overflow-hidden duration-300 rounded-sm left-[3rem] z-10 py-2 group-hover:px-2 group-hover:text-white backdrop-blur-sm pointer-events-none"
         >
            Chats
         </span>
      </a>
   </nav>
</aside>
