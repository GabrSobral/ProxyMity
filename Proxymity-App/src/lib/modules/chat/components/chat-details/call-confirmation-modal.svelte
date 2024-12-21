<script lang="ts">
	import { goto } from '$app/navigation';

	import * as Dialog from '$lib/components/ui/dialog';
	import Button from '$lib/components/ui/button/button.svelte';

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
			if ($chatState.conversations[$chatState.selectedConversationIndex]?.id) {
				$chatState.conversations[$chatState.selectedConversationIndex].participants.forEach(
					(item) => {
						$peerState?.onUserConnected(item.id);
					}
				);

				$callWebSocketEmitter.callChat({
					callId: $chatState.conversations[$chatState.selectedConversationIndex]?.id
				});
			}

			goto(`/call/${$chatState.conversations[$chatState.selectedConversationIndex]?.id}`);
		}, 3000);
	}
</script>

<Dialog.Root controlledOpen={isOpened}>
	<Dialog.Content>
		<Dialog.Title>Are you sure?</Dialog.Title>

		<Dialog.Description
			>You are about to start a call, click "Confirm" to continue</Dialog.Description
		>

		<div class="ml-auto flex gap-4">
			<Button type="button" onclick={closeDialog}>Cancel</Button>
			<Button type="button" onclick={confirmCall}>Confirm</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>
