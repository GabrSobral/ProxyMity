<script lang="ts">
   import * as Dialog from '$lib/components/ui/dialog';
   import type { ILocalMessage } from '../../../../../../types/message';

   type $$Props = {
      isOpened: boolean;
      closeDialog: () => void;
      selectedMessage: ILocalMessage | null;
   };

   let { isOpened, closeDialog }: $$Props = $props();
</script>

<Dialog.Root controlledOpen={isOpened}>
   <Dialog.Content>
      <Dialog.Title>Message Status</Dialog.Title>
      <Dialog.Description>Your message was sent successfully.</Dialog.Description>
   </Dialog.Content>
</Dialog.Root>
