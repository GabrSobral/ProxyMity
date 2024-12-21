<script lang="ts">
	import { page } from '$app/stores';
	import { User, Pin, PhoneCall } from 'lucide-svelte';

	import { pinConversationAsync } from '../../services/pinConversationAsync';
	import { unpinConversationAsync } from '../../services/unpinConversationAsync';

	import { chatDispatch, chatState } from '../../contexts/chat-context/stores/chat';
	import CallConfirmationModal from './call-confirmation-modal.svelte';
	import { callWebSocketEmitter } from '../../contexts/websocket-context/stores/connection';

	let isConfirmationCallModalOpened = $state(false);

	let session = $derived($page.data.session);

	let contact = $derived(
		$chatState.conversations[$chatState.selectedConversationIndex]?.participants[0]
	);
	let isChatPinned = $derived(
		!!$chatState.conversations[$chatState.selectedConversationIndex]?.conversationPinnedAt
	);

	let conversationName = $derived(
		$chatState.conversations[$chatState.selectedConversationIndex]?.groupName ||
			$chatState.conversations[$chatState.selectedConversationIndex]?.participants.find(
				(item) => item.id !== session?.user?.id
			)?.firstName ||
			''
	);

	function handleCall() {
		isConfirmationCallModalOpened = true;
	}

	async function handlePin() {
		if (!$chatState.conversations[$chatState.selectedConversationIndex]) {
			console.warn('No conversation was selected.');
			return;
		}

		if (!session?.accessToken) {
			console.warn('No access token was detected.');
			return;
		}

		chatDispatch.handleConversationPin({
			conversationId: $chatState.conversations[$chatState.selectedConversationIndex]?.id
		});

		const conversationId = $chatState.conversations[$chatState.selectedConversationIndex].id;

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

<header
	class="blue-shadow flex flex-col gap-3 rounded-[10px] bg-gradient-to-br from-[#5852D6] to-[#372494] p-3"
>
	<div class="flex gap-3">
		<div class="relative max-h-[40px] min-h-[40px] min-w-[40px] max-w-[40px]">
			<div
				class="z-0 flex max-h-[40px] min-h-[40px] min-w-[40px] max-w-[40px] items-center justify-center rounded-full bg-black shadow-xl dark:bg-white"
			>
				<User size={20} class="text-white dark:text-black" />
			</div>
		</div>

		<div class="flex flex-col overflow-hidden">
			<strong class="text-lg font-light text-white">{conversationName}</strong>

			{#if !$chatState.conversations[$chatState.selectedConversationIndex]?.isGroup}
				<span class="truncate text-sm font-light text-gray-200">{contact?.email}</span>
			{/if}
		</div>
	</div>

	<div class="flex gap-3">
		<button
			type="button"
			onclick={handleCall}
			class="rounded-[8px] bg-purple-400 p-2 shadow-lg transition-all hover:brightness-150 active:scale-90"
			title={`Start a voice call with  ${conversationName}`}
		>
			<PhoneCall class="text-white" size={28} />
		</button>

		<button
			onclick={handlePin}
			type="button"
			class="rounded-[8px] bg-purple-400 p-2 shadow-lg transition-all hover:brightness-150 active:scale-90"
			title={`Pin ${conversationName}'s conversation`}
		>
			<Pin class="text-white" size={28} />
		</button>
	</div>

	{#if $chatState.conversations[$chatState.selectedConversationIndex]?.groupDescription}
		<div>
			<span class="font-medium text-white">Description:</span>
			<p class="font-light text-gray-200">
				{$chatState.conversations[$chatState.selectedConversationIndex]?.groupDescription}
			</p>
		</div>
	{/if}

	<!-- <div class="flex flex-col gap-2">
      <span class="text-white font-medium block">Badges:</span>

      <div class="flex flex-wrap gap-2">
         <span class="p-1 px-2 rounded-full bg-yellow-500 text-sm text-white w-fit">JS Developer</span>
         <span class="p-1 px-2 rounded-full bg-orange-400 text-sm text-white w-fit">Fullstack</span>
         <span class="p-1 px-2 rounded-full bg-blue-400 text-sm text-white w-fit">ReactJS</span>
         <span class="p-1 px-2 rounded-full bg-green-600 text-sm text-white w-fit">NodeJS</span>
      </div>
   </div> -->

	<CallConfirmationModal
		isOpened={isConfirmationCallModalOpened}
		closeDialog={() => {
			isConfirmationCallModalOpened = false;
		}}
	/>
</header>
