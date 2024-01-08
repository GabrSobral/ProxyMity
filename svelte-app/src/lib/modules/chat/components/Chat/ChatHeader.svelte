<script lang="ts">
	import clsx from 'clsx';
	import { page } from '$app/stores';
	import { PushPin, User, X } from 'phosphor-svelte';

	import { chatDispatch, chatState } from '../../contexts/chat-context/stores/chat';

	$: user = $page.data.session?.user;

	$: conversationName =
		$chatState.selectedConversation?.groupName ||
		$chatState.selectedConversation?.participants.find(item => item.id !== user?.id)?.name ||
		'';

	$: showConversationDetail = $chatState.showConversationDetail;
</script>

<header class="px-3 py-2 dark:bg-black bg-white flex items-center gap-4 transition-all overflow-hidden">
	<div class="relative min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px]">
		<div
			class="min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px] rounded-full z-0 shadow-xl flex items-center justify-center bg-gray-700"
		>
			<User size={20} class="text-white" />
		</div>
	</div>

	<h2 class="dark:text-gray-300 text-gray-500 font-light tracking-wide transition-all overflow-ellipsis">
		Conversation with <strong class="dark:text-white text-gray-700">{conversationName}</strong>
	</h2>

	<div class="flex gap-1 ml-auto">
		<button
			title="Pin chat"
			class="rounded-full p-2 dark:bg-black bg-white hover:bg-purple-500 transition-all group hover:text-white dark:dark:text-whit text-gray-700"
			type="button"
		>
			<PushPin size={24} weight="light" class="dark:text-white text-gray-700 group-hover:text-white" />
		</button>

		<button
			title="Conversation info"
			class={clsx('rounded-full p-2 hover:bg-purple-500 transition-all hover:text-white group ', {
				'bg-purple-500': showConversationDetail,
				'dark:bg-black bg-white': !showConversationDetail,
			})}
			type="button"
			on:click={chatDispatch.handleShowConversationDetail}
		>
			<User
				size={24}
				weight="light"
				class={clsx(' group-hover:text-white', {
					'text-white': showConversationDetail,
					'dark:text-white text-gray-700': !showConversationDetail,
				})}
			/>
		</button>

		<button
			type="button"
			on:click={() => chatDispatch.selectConversation({ conversation: null, typeMessage: '' })}
			title="Close chat"
			class="rounded-full p-2 dark:bg-black bg-white hover:bg-purple-500 hover:text-white group transition-all dark:text-white text-gray-700"
		>
			<X size={24} weight="light" class="dark:text-white text-gray-700 group-hover:text-white" />
		</button>
	</div>
</header>
