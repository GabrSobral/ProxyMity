<script lang="ts">
   import { goto } from '$app/navigation';
   import { fly } from 'svelte/transition';
   import { PhoneCall, PhoneMissed, PhoneOff } from 'lucide-svelte';

   import { peerState } from '$lib/modules/chat/contexts/call-context/stores/peer';
   import { chatState } from '$lib/modules/chat/contexts/chat-context/stores/chat';

   let rejectIn = $state(20);

   let isCalling = $state(true);

   type Props = {
      chatId: string;
      userId: string;
      closeNotification: () => void;
   };

   let { chatId, userId, closeNotification }: Props = $props();

   $effect(() => {
      const interval = setInterval(() => {
         if (rejectIn > 0) {
            rejectIn -= 1;
         }
      }, 1000);

      return () => clearInterval(interval);
   });

   function joinCall() {
      const conversation = $chatState.conversations.find(item => item.id === chatId);

      conversation?.participants.forEach(item => {
         $peerState?.onUserConnected(item.id);
      });

      goto(`/call/${chatId}`);
      closeNotification();
   }
</script>

{#if isCalling}
   <div
      transition:fly={{ duration: 300, opacity: 0, x: 300 }}
      class="fixed right-4 bottom-10 rounded-[10px] p-3 bg-gradient-to-br from-[#5852D6] to-[#372494] blue-shadow flex flex-col gap-3 backdrop-blur-md"
   >
      <div class="flex gap-4 items-center">
         <img src="https://github.com/GabrSobral.png" alt="Participant" class="w-[32px] h-[32px] rounded-full" />

         <div>
            <span class="text-white text-sm font-bold">Gabriel Sobral</span>
            <span class="text-white text-sm">is calling you...</span>
         </div>

         <PhoneCall size={16} class="text-white animate-ping ml-auto" />
      </div>

      <span class="text-white text-xs font-light">You will automatically reject in {rejectIn} seconds...</span>

      <div class="flex gap-1 justify-between w-full">
         <button
            type="button"
            onclick={joinCall}
            title="Join Call"
            class="items-center flex gap-2 w-[6rem] rounded-md flex-1 bg-green-600 py-2 px-3 text-white text-sm hover:brightness-90 transition-all"
         >
            <PhoneCall size={16} /> Join
         </button>

         <button
            type="button"
            class="items-center flex gap-2 w-[6rem] rounded-md flex-1 border-2 border-purple-500 py-2 px-3 text-white text-sm hover:brightness-90 transition-all"
         >
            <PhoneMissed size={16} /> Ignore
         </button>

         <button
            type="button"
            onclick={() => {
               isCalling = false;
            }}
            class="items-center flex gap-2 w-[6rem] rounded-md flex-1 bg-red-600 py-2 px-3 text-white text-sm hover:brightness-90 transition-all"
         >
            <PhoneOff size={16} /> Reject
         </button>
      </div>
   </div>
{/if}
