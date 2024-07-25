<script lang="ts">
   import { page } from '$app/stores';
   import { User, Pin, PhoneCall } from 'lucide-svelte';

   import { pinConversationAsync } from '../../services/pinConversationAsync';
   import { unpinConversationAsync } from '../../services/unpinConversationAsync';

   import { chatDispatch, chatState } from '../../contexts/chat-context/stores/chat';
   import CallConfirmationModal from './call-confirmation-modal.svelte';

   let isConfirmationCallModalOpened = $state(false);

   let session = $derived($page.data.session);

   let contact = $derived($chatState.selectedConversation?.participants[0]);
   let isChatPinned = $derived(!!$chatState.selectedConversation?.conversationPinnedAt);

   let conversationName = $derived(
      $chatState.selectedConversation?.groupName ||
         $chatState.selectedConversation?.participants.find(item => item.id !== session?.user?.id)?.firstName ||
         ''
   );

   function handleCall() {
      isConfirmationCallModalOpened = true;
   }

   async function handlePin() {
      if (!$chatState.selectedConversation) {
         console.warn('No conversation was selected.');
         return;
      }

      if (!session?.accessToken) {
         console.warn('No access token was detected.');
         return;
      }

      chatDispatch.handleConversationPin({ conversationId: $chatState.selectedConversation?.id });

      const conversationId = $chatState.selectedConversation.id;

      try {
         if (isChatPinned) {
            unpinConversationAsync({ conversationId }, { accessToken: session?.accessToken });
         } else {
            pinConversationAsync({ conversationId }, { accessToken: session?.accessToken });
         }
      } catch (error: any) {
         console.error('Error on trying to handle with pin and unpin chat.', error);
      }
   }
</script>

<header class="rounded-[10px] p-3 bg-gradient-to-br from-[#5852D6] to-[#372494] blue-shadow flex flex-col gap-3">
   <div class="flex gap-3">
      <div class="relative min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px]">
         <div
            class="min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px] rounded-full z-0 shadow-xl flex items-center justify-center dark:bg-white bg-black"
         >
            <User size={20} class="text-white dark:text-black" />
         </div>
      </div>

      <div class="flex flex-col overflow-hidden">
         <strong class="text-white font-light text-lg">{conversationName}</strong>

         {#if !$chatState.selectedConversation?.isGroup}
            <span class="text-gray-200 font-light text-sm truncate">{contact?.email}</span>
         {/if}
      </div>
   </div>

   <div class="flex gap-3">
      <button
         type="button"
         onclick={handleCall}
         class="shadow-lg p-2 bg-purple-400 rounded-[8px] hover:brightness-150 transition-all active:scale-90"
         title={`Start a voice call with  ${conversationName}`}
      >
         <PhoneCall class="text-white" size={28} />
      </button>

      <button
         onclick={handlePin}
         type="button"
         class="shadow-lg p-2 bg-purple-400 rounded-[8px] hover:brightness-150 transition-all active:scale-90"
         title={`Pin ${conversationName}'s conversation`}
      >
         <Pin class="text-white" size={28} />
      </button>
   </div>

   {#if $chatState.selectedConversation?.groupDescription}
      <div>
         <span class="text-white font-medium">Description:</span>
         <p class="text-gray-200 font-light">{$chatState.selectedConversation?.groupDescription}</p>
      </div>
   {/if}

   <div class="flex flex-col gap-2">
      <span class="text-white font-medium block">Badges:</span>

      <div class="flex flex-wrap gap-2">
         <span class="p-1 px-2 rounded-full bg-yellow-500 text-sm text-white w-fit">JS Developer</span>
         <span class="p-1 px-2 rounded-full bg-orange-400 text-sm text-white w-fit">Fullstack</span>
         <span class="p-1 px-2 rounded-full bg-blue-400 text-sm text-white w-fit">ReactJS</span>
         <span class="p-1 px-2 rounded-full bg-green-600 text-sm text-white w-fit">NodeJS</span>
      </div>
   </div>

   <CallConfirmationModal
      isOpened={isConfirmationCallModalOpened}
      closeDialog={() => {
         isConfirmationCallModalOpened = false;
      }}
   />
</header>
