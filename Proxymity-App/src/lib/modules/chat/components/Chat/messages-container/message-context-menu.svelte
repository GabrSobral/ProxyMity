<script lang="ts">
	import { page } from '$app/stores';

	import { Copy, ReplyIcon } from 'lucide-svelte';

	import Text from '$lib/components/ui/text.svelte';
	import * as ContextMenu from '$lib/components/ui/context-menu';

	import {
		chatDispatch,
		chatState,
		typebarRef
	} from '$lib/modules/chat/contexts/chat-context/stores/chat';
	import type { ILocalMessage } from '../../../../../../types/message';

	type Props = {
		selectedMessage: ILocalMessage | null;
		isMessageStatusDialogOpened: boolean;
	};

	let { selectedMessage, isMessageStatusDialogOpened }: Props = $props();
	let myId = $page.data.session?.user.id;
</script>

<ContextMenu.Content class="w-64 overflow-hidden">
	<Text size="sm" class="ml-1 flex flex-1 overflow-hidden text-primary">
		Mensagem: <span
			class="ml-1 overflow-hidden truncate font-semibold"
			title={selectedMessage?.content || '-'}
		>
			{selectedMessage?.content || '-'}
		</span>
	</Text>

	<div class="mt-2 rounded-md">
		<ContextMenu.Item
			onclick={() => {
				if (selectedMessage) {
					chatDispatch.setReplyMessageFromConversation({
						conversationId: selectedMessage.conversationId,
						message: selectedMessage
					});
					$typebarRef?.focus();
				}
			}}
		>
			Reply
			<ContextMenu.Shortcut>
				<ReplyIcon size={18} class="text-white" />
			</ContextMenu.Shortcut>
		</ContextMenu.Item>

		<ContextMenu.Item
			onclick={() => {
				navigator.clipboard.writeText(selectedMessage?.content || '');
			}}
		>
			Copy
			<ContextMenu.Shortcut>
				<Copy size={18} class="text-white" />
			</ContextMenu.Shortcut>
		</ContextMenu.Item>

		<!-- {#if selectedMessage?.author.id === myId}
         <ContextMenu.Sub>
            <ContextMenu.SubTrigger>Status</ContextMenu.SubTrigger>

            <ContextMenu.SubContent class="w-48 overflow-hidden">
               {#each $chatState.conversations[$chatState.selectedConversationIndex]?.participants || [] as participant (participant.id)}
                  <ContextMenu.Sub>
                     <ContextMenu.Item class="truncate overflow-hidden" onclick={() => (isMessageStatusDialogOpened = true)}>
                        {participant.firstName}
                        {participant.lastName}
                     </ContextMenu.Item>
                  </ContextMenu.Sub>
               {/each}
            </ContextMenu.SubContent>
         </ContextMenu.Sub>
      {/if} -->
	</div>
</ContextMenu.Content>
