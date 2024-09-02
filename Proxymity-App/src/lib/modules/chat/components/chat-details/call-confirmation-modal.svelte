<script lang="ts">
   import { goto } from '$app/navigation';

   import * as Dialog from '$lib/design-system/dialog';
   import Button from '$lib/design-system/button/button.svelte';

   import { chatState } from '../../contexts/chat-context/stores/chat';
   import { callWebSocketEmitter } from '../../contexts/websocket-context/stores/connection';
   import { peerState } from '../../contexts/call-context/stores/peer';

   type Props = {
      closeDialog: () => void;
      isOpened: boolean;
   };

   const { closeDialog, isOpened }: Props = $props();

   function confirmCall() {
      closeDialog();
      setTimeout(() => {
         if ($chatState.selectedConversation?.id) {
            $chatState.selectedConversation.participants.forEach(item => {
               $peerState?.onUserConnected(item.id);
            });

            $callWebSocketEmitter.callChat({ callId: $chatState.selectedConversation?.id });
         }

         goto(`/call/${$chatState.selectedConversation?.id}`);
      }, 3000);
   }
</script>

<Dialog.Root {closeDialog} {isOpened}>
   <Dialog.Panel>
      <Dialog.Title>Are you sure?</Dialog.Title>

      <Dialog.Description>You are about to start a call, click "Confirm" to continue</Dialog.Description>

      <div class="flex gap-4 ml-auto">
         <Button type="button" isOutlined onclick={closeDialog}>Cancel</Button>
         <Button type="button" onclick={confirmCall}>Confirm</Button>
      </div>
   </Dialog.Panel>
</Dialog.Root>
