<script lang="ts">
	import { chatDispatch } from '$lib/modules/chat/contexts/chat-context/stores/chat';
	import clsx from 'clsx';
	import { User } from 'phosphor-svelte';
	import { twMerge } from 'tailwind-merge';

	let index: number;
	let conversation: any = {};

	let typing = false;
	$: isTyping = typing;

	let isSelectedContact = true;

	const formatLastMessageDate = Intl.DateTimeFormat('pt-br', { hour: 'numeric', minute: 'numeric' });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	role="button"
	tabindex="0"
	class="w-full relative py-2 px-3 rounded-xl flex gap-4 cursor-pointer hover:opacity-90 group dark:bg-gray-900 bg-white transition-all shadow-md"
	on:click={() => chatDispatch.selectConversation(conversation)}
>
	<div
		class={`${
			isSelectedContact ? 'w-full left-0 opacity-100' : 'w-0 left-2/4 opacity-10'
		} absolute h-full gradient transition-all rounded-xl top-0 z-0 duration-[0.3s] mx-auto`}
	/>
	<div class="relative min-w-[46px] min-h-[46px] max-w-[46px] max-h-[46px]">
		<div
			class="min-w-[46px] min-h-[46px] max-w-[46px] max-h-[46px] rounded-full z-0 shadow-xl flex items-center justify-center dark:bg-gray-700 bg-white transition-colors"
		>
			<User size={24} class="dark:text-white text-gray-700 transition-colors" />
		</div>
	</div>

	<div class={'flex flex-col gap-1 overflow-hidden w-full z-10'}>
		<span
			class={`${
				isSelectedContact ? 'text-white' : 'text-gray-700 dark:text-gray-200'
			} truncate font-medium flex items-center justify-between gap-3 `}
		>
			Conversation Name
			<!-- {conversationName} {conversation.id === user?.id && '(You)'} -->
			<span
				class="text-[12px] dark:text-gray-200 transition-colors text-gray-700 ml-auto data-[is-selected=true]:text-gray-100"
				data-is-selected={isSelectedContact}
			>
				{formatLastMessageDate.format(new Date())}
			</span>
		</span>

		<div
			class={twMerge(
				clsx('truncate flex justify-between gap-4 dark:text-gray-200 text-gray-600 text-sm', {
					'text-purple-500': typing && !isSelectedContact,
					'text-white': isSelectedContact,
				})
			)}
		>
			{#if isTyping}
				<span>Typing...</span>
			{:else if false}
				<span>Last message here.</span>
			{:else}
				<span>Start the conversation...</span>
			{/if}
			<!-- 
            {typing ? (
                <PulseLoader
                    color={isSelectedContact ? '#FFFFFF' : tailwindColors.purple['500']}
                    size={8}
                    title="Typing..."
                />
            ) : lastMessage ? (
                lastMessage.content
            ) : (
                <span>Start the conversation...</span>
            )} -->

			<!-- {conversation.notifications > 0 && (
                <span class="rounded-full bg-purple-500 w-5 h-5 ml-auto flex items-center justify-center text-[12px] text-white font-medium animate-pulse z-10">
                    {conversation.notifications}
                </span>
            )} -->
		</div>
	</div>
</div>
