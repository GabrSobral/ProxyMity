<script lang="ts">
	import { toggleMode } from 'mode-watcher';
	import { MessageSquarePlus, Moon, Search, Sun } from 'lucide-svelte';

	import ChatList from './chat-list/index.svelte';
	import SettingsMenu from './settings-menu.svelte';

	import Text from '$lib/components/ui/text.svelte';
	import Heading from '$lib/components/ui/heading.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import InputGroup from '$lib/components/ui/Input/InputGroup.svelte';

	import { chatState } from '../../contexts/chat-context/stores/chat';
	import CreateConversationModal from '$lib/modules/chat/components/create-conversation-modal/index.svelte';

	let isNewContactModalOpened = $state(false);
	let allNotificationsCount = $derived(
		$chatState.conversations.reduce((accumulator, curr) => accumulator + curr.notifications, 0)
	);

	let closeSettingsModal = () => (isNewContactModalOpened = false);
</script>

<aside
	class="flex max-w-[25rem] flex-col gap-2 overflow-hidden bg-background p-2 shadow-lg transition-all duration-300 lg:min-w-[25rem]"
>
	<div class="flex items-center gap-4 px-1 transition-all">
		<SettingsMenu />

		<Heading size="lg" class="flex items-center gap-3 text-primary">
			Messages

			{#if allNotificationsCount > 0}
				<span
					class="flex max-h-[1.25rem] min-h-[1.25rem] min-w-[1.25rem] max-w-[1.25rem] items-center justify-center rounded-full bg-purple-500 p-1 text-[0.6rem] text-white"
				>
					{allNotificationsCount}
				</span>
			{/if}
		</Heading>

		<div class="ml-auto flex gap-4">
			<Button
				variant="outline"
				onclick={toggleMode}
				title="Create a new conversation"
				aria-label="add a new contact to your contact list"
			>
				<Sun
					class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
				/>
				<Moon
					class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
				/>
			</Button>
		</div>
	</div>

	<InputGroup let:Label let:Input let:Wrapper className="px-0 p-0 w-full">
		<Label className="sr-only">Search</Label>

		<Wrapper className="w-full justify-between px-1">
			<Input type="search" placeholder="Search..." class="w-full pr-12" />
			<Search class="absolute bottom-0 right-0 top-0 m-auto mr-3 text-gray-400" size={24} />
		</Wrapper>
	</InputGroup>

	<CreateConversationModal closeModal={closeSettingsModal} isOpened={isNewContactModalOpened} />

	{#if $chatState.conversations.length === 0}
		<div class="flex flex-col items-center justify-center">
			<img src="no-messages.svg" alt="No chat was selected." width="200" height="200" />

			<Text size="md" class="text-center text-primary"
				>No chats found. <br /> Start a conversation with someone!</Text
			>
		</div>
	{:else}
		<ChatList />
	{/if}
</aside>
