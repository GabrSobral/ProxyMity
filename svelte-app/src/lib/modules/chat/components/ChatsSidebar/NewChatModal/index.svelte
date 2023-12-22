<script lang="ts">
	import { page } from '$app/stores';
	import { MagnifyingGlass, Plus } from 'phosphor-svelte';

	import Text from '$lib/design-system/Text.svelte';
	import Button from '$lib/design-system/Button.svelte';
	import Dialog from '$lib/design-system/Dialog/Dialog.svelte';
	import InputGroup from '$lib/design-system/Input/InputGroup.svelte';

	import { getUserByEmailAsync } from '$lib/modules/chat/services/getUserByEmailAsync';
	import { createPrivateConversationAsync } from '$lib/modules/chat/services/createPrivateConversationAsync';

	import type { UserApi } from '../../../../../../types/user';
	import UserItem from './UserItem.svelte';
	import SelectedUserItem from './SelectedUserItem.svelte';

	export let show: boolean;
	export let closeModal: () => void;

	let isGroup = false;
	let errorMessage = '';
	let value = '';

	let accountsData: {
		selectedAccounts: UserApi[];
		account: UserApi | null;
	} = {
		selectedAccounts: [],
		account: null,
	};

	$: accessToken = $page.data.session.accessToken as string;

	async function searchAccount() {
		if (!accessToken) {
			return console.error('Access Token is not defined');
		}

		if (value === '') {
			errorMessage = 'The search input can not be empty.';
			return console.error('Access Token is not defined');
		}

		errorMessage = '';

		try {
			const account = await getUserByEmailAsync({ userEmail: value || '' }, { accessToken });

			accountsData = { ...accountsData, account };
		} catch (error: any) {
			console.error(error);
			accountsData = { ...accountsData, account: null };

			errorMessage = error?.response?.data?.error || error.message;
		}
	}

	function addAccount(newAccount: UserApi) {
		if (accountsData.selectedAccounts.some(item => item.id === newAccount.id)) {
			accountsData = { ...accountsData, account: null };
			return console.warn('This account is already selected. Try another one.');
		}

		accountsData = { account: null, selectedAccounts: [newAccount, ...accountsData.selectedAccounts] };
	}

	function removeAccount(account: UserApi) {
		accountsData = {
			...accountsData,
			selectedAccounts: accountsData.selectedAccounts.filter(item => item.id !== account.id),
		};
	}

	async function createConversationSubmit() {
		if (!accessToken) {
			return console.error('Access Token is not defined');
		}

		await createPrivateConversationAsync({ participantId: '' }, { accessToken });
	}
</script>

<Dialog let:Title let:Description {show} {closeModal} className="w-[30rem] gap-4">
	<Title>Create a new conversation</Title>

	<Description>Search for a contact to create a conversation.</Description>

	<form class="flex flex-col gap-4" on:submit|preventDefault={createConversationSubmit}>
		<fieldset class="flex gap-4">
			<InputGroup let:Input let:Label let:ErrorMessage>
				<Label>Search e-mail</Label>

				<Input type="email" placeholder="E.g: john_doe@email.com" />

				{#if errorMessage}
					<ErrorMessage>{errorMessage}</ErrorMessage>
				{/if}
			</InputGroup>

			<Button tabIndex={2} type="button" class="mt-8 h-[3.5rem]" title="Search user" onClick={searchAccount}>
				<MagnifyingGlass color="white" size={24} />
			</Button>
		</fieldset>

		<Text
			size="lg"
			className="flex gap-4 cursor-pointer items-center w-fit"
			on:click={() => {
				isGroup = !isGroup;
			}}
		>
			<!-- <Switch checked={isGroup} /> -->
			Is a group?

			{#if isGroup}
				<Text size="md" className="text-green-500 dark:text-green-500">Yes</Text>
			{:else}
				<Text size="md" className="text-red-500 dark:text-red-500">No</Text>
			{/if}
		</Text>

		{#if accountsData.account}
			<UserItem
				user={accountsData.account}
				addAccount={() => accountsData.account && addAccount(accountsData.account)}
			/>
		{/if}

		<ul class="flex flex-col gap-3">
			{#each accountsData.selectedAccounts as account (account.id)}
				<SelectedUserItem user={account} isSelected removeAccount={() => removeAccount(account)} />
			{/each}
		</ul>

		<Button tabIndex={-3} type="submit" className="w-full">
			<Plus color="white" size={24} />
			Create conversation
		</Button>
	</form>
</Dialog>
