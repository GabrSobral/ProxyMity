<script lang="ts">
   import * as Dialog from '$lib/design-system/dialog';
   import type { ILocalMessage } from '../../../../../../types/message';

   type $$Props = {
      isOpened: boolean;
      closeDialog: () => void;
      selectedMessage: ILocalMessage | null;
   };

   let { isOpened, closeDialog }: $$Props = $props();
</script>

<Dialog.Root {isOpened} {closeDialog}>
   <Dialog.Panel>
      <Dialog.Title>Message Status</Dialog.Title>
      <Dialog.Description>Your message was sent successfully.</Dialog.Description>
   </Dialog.Panel>
</Dialog.Root>
