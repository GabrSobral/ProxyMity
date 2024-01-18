<script lang="ts">
   import { page } from '$app/stores';

   import { User, Pin, PhoneCall, Camera, Speaker } from 'lucide-svelte';

   import { chatState } from '../../contexts/chat-context/stores/chat';

   $: user = $page.data.session?.user;

   $: conversationName =
      $chatState.selectedConversation?.groupName ||
      $chatState.selectedConversation?.participants.find(item => item.id !== user?.id)?.name ||
      '';

   $: contact = $chatState.selectedConversation?.participants[0];
</script>

<header class="rounded-[10px] p-3 bg-purple-400 flex flex-col gap-3">
   <div class="flex gap-3">
      <div class="relative min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px]">
         <div
            class="min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px] rounded-full z-0 shadow-xl flex items-center justify-center bg-gray-700"
         >
            <User size={20} class="text-white" />
         </div>
      </div>

      <div class="flex flex-col overflow-hidden">
         <strong class="text-white font-light text-lg">{conversationName}</strong>
         <span class="text-gray-200 font-light text-sm truncate">{contact?.email}</span>
      </div>
   </div>

   <div class="flex gap-3">
      <button
         type="button"
         class="brightness-125 p-2 bg-purple-400 rounded-[12px] hover:brightness-150 transition-all active:scale-90"
         title="Start a voice call with Diego"
      >
         <PhoneCall class="text-white" size={28} />
      </button>

      <button
         type="button"
         class="brightness-125 p-2 bg-purple-400 rounded-[12px] hover:brightness-150 transition-all active:scale-90"
         title="Start a video call with Diego"
      >
         <Camera class="text-white" size={28} />
      </button>

      <button
         type="button"
         class="brightness-125 p-2 bg-purple-400 rounded-[12px] hover:brightness-150 transition-all active:scale-90"
         title="Pin Diego's conversation"
      >
         <Pin class="text-white" size={28} />
      </button>

      <button
         type="button"
         class="brightness-125 p-2 bg-purple-400 rounded-[12px] hover:brightness-150 transition-all active:scale-90"
         title="Mute Diego's conversation"
      >
         <Speaker class="text-white" size={28} />
      </button>
   </div>

   <div>
      <span class="text-white font-medium">Description:</span>
      <p class="text-gray-200 font-light">Hello, everybody! 😊</p>
   </div>

   <div class="flex flex-col gap-2">
      <span class="text-white font-medium block">Badges:</span>

      <div class="flex flex-wrap gap-2">
         <span class="p-1 px-2 rounded-full bg-yellow-500 text-sm text-white w-fit">JS Developer</span>

         <span class="p-1 px-2 rounded-full bg-orange-400 text-sm text-white w-fit">Fullstack</span>

         <span class="p-1 px-2 rounded-full bg-blue-400 text-sm text-white w-fit">ReactJS</span>

         <span class="p-1 px-2 rounded-full bg-green-600 text-sm text-white w-fit">NodeJS</span>
      </div>
   </div>
</header>
