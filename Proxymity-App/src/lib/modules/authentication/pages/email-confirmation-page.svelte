<script lang="ts">
	import { goto } from '$app/navigation';
	import { MessageCircleHeartIcon } from 'lucide-svelte';

	import Text from '$lib/components/ui/text.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import LoadingSpinning from '$lib/components/ui/loading-spinning.svelte';

	import WarningAlert from '../components/warning-alert.svelte';

	import { page } from '$app/stores';

	let isLoading = $state(false);

	let errorAlertConfig = $state('');

	let isConfirmed = $derived($page.data.isConfirmed as boolean);
	let error = $derived($page.data.error as any);

	async function handleSubmit() {
		isLoading = true;
		goto('/');
	}
</script>

{#if errorAlertConfig}
	<WarningAlert
		errorMessage={errorAlertConfig}
		closeAlert={() => {
			errorAlertConfig = '';
		}}
	/>
{/if}

{#if isConfirmed}
	<img
		src="/no-messages.svg"
		width="250"
		class="mb-6"
		alt="Success ProxyMity, that shows to chat boxes on left side, and a purple planet on right side."
	/>

	<div class="flex flex-col gap-1">
		<Text size="md">
			Your email has been <span class="font-bold text-purple-300">successfully confirmed!</span>
		</Text>
		<Text size="md">
			You will now be able to log in to your account to use the ProxyMity system
		</Text>
	</div>

	<Button
		class="mt-6 w-full"
		onclick={handleSubmit}
		disabled={isLoading}
		title={isLoading ? 'Loading...' : 'Navigate to chat app'}
	>
		{#if isLoading}
			<LoadingSpinning size={32} lineSize={2} color="white" />
		{:else}
			<MessageCircleHeartIcon size={32} class="text-white" />
			Navigate to chat app
		{/if}
	</Button>
{/if}

{#if error}
	<div class="flex flex-col gap-1">
		<Text size="md"
			>An <span class="font-bold text-red-500">error</span> ocurred on trying to confirm your e-mail.</Text
		>

		<Text size="md" class="mt-2">{error.title}</Text>
	</div>
{/if}
