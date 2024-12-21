<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
	import { Eye, LogIn, EyeOff } from 'lucide-svelte';

	import WarningAlert from '../components/warning-alert.svelte';

	import { goto } from '$app/navigation';

	import Button from '$lib/components/ui/button/button.svelte';
	import InputGroup from '$lib/components/ui/Input/InputGroup.svelte';
	import LoadingSpinning from '$lib/components/ui/loading-spinning.svelte';

	import { logError } from '../../../../utils/logging';

	//#region States
	let email = $state('');
	let password = $state('');

	let showPassword = $state(false);
	let isLoading = $state(false);

	let errorAlertConfig = $state('');
	//#endregion

	//#region Functions
	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		isLoading = true;

		try {
			const response = await signIn('credentials', {
				email,
				password,
				command: 'sign-in',
				redirect: false
			});
			const content = await response?.json();

			const urlObj = new URL(content.url);
			const params = new URLSearchParams(urlObj.search);
			const hasError = !!params.get('error');

			if (hasError) {
				throw new Error(params.get('code') || 'An error occurred');
			}

			goto('/');
		} catch (error: any) {
			logError(error?.message);

			errorAlertConfig = error.message;
		}

		isLoading = false;
	}

	//#endregion
</script>

{#if errorAlertConfig}
	<WarningAlert
		errorMessage={errorAlertConfig}
		closeAlert={() => {
			errorAlertConfig = '';
		}}
	/>
{/if}

<form onsubmit={handleSubmit} class="flex w-full flex-col gap-4">
	<InputGroup let:Label let:Wrapper let:Input let:ErrorMessage>
		<Label className="text-white">E-mail</Label>

		<Wrapper className="w-full">
			<Input
				type="email"
				name="email"
				placeholder="Type your e-mail"
				autocomplete="email"
				title="Type your e-mail"
				bind:value={email}
				required
				class="border-gray-700 bg-white/10 text-white ring-gray-700 placeholder:text-gray-100"
			/>
		</Wrapper>
	</InputGroup>

	<InputGroup let:Label let:Wrapper let:Input let:ErrorMessage>
		<Label className="text-white">Password</Label>

		<Wrapper className="w-full">
			<Input
				type={showPassword ? 'text' : 'password'}
				name="password"
				placeholder="**********"
				autocomplete="current-password"
				title="Type your password"
				bind:value={password}
				required
				class="border-gray-700 bg-white/10 text-white ring-gray-700 placeholder:text-gray-100 dark:text-white"
			/>

			<button
				type="button"
				aria-label={showPassword ? 'Hide password' : 'Show Password'}
				onclick={() => (showPassword = !showPassword)}
				class="absolute right-4 top-2/4 -translate-y-2/4"
				title={showPassword ? 'Hide password' : 'Show Password'}
			>
				{#if showPassword}
					<EyeOff class="text-gray-100 dark:text-gray-200" size={24} />
				{:else}
					<Eye class="text-gray-100 dark:text-gray-200" size={24} />
				{/if}
			</button>
		</Wrapper>
	</InputGroup>

	<a
		href="/auth/forgot-password"
		data-sveltekit-preload-data="hover"
		class="mx-auto text-sm text-purple-300 underline-offset-2 hover:underline"
	>
		Forgot password
	</a>

	<Button
		type="submit"
		class="w-full text-white"
		variant="default"
		disabled={!(email && password) || isLoading}
		title={isLoading ? 'Loading...' : 'Sign In'}
	>
		{#if isLoading}
			<LoadingSpinning size={32} lineSize={2} color="white" />
		{:else}
			<LogIn size={32} class="text-white" />
			Sign In
		{/if}
	</Button>
</form>
