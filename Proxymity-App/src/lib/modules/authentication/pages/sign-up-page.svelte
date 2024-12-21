<script lang="ts">
	import { goto } from '$app/navigation';
	import { signIn } from '@auth/sveltekit/client';
	import { Eye, UserPlus, EyeOff } from 'lucide-svelte';

	import Button from '$lib/components/ui/button/button.svelte';
	import InputGroup from '$lib/components/ui/Input/InputGroup.svelte';
	import LoadingSpinning from '$lib/components/ui/loading-spinning.svelte';

	import WarningAlert from '../components/warning-alert.svelte';
	import StrongPasswordModal from '../components/strong-password-modal.svelte';
	import { logError } from '../../../../utils/logging';

	let firstName = $state('');
	let lastName = $state('');
	let email = $state('');
	let password = $state('');

	let showPassword = $state(false);
	let isLoading = $state(false);

	let isStrongPasswordModalVisible = $state(false);
	let errorAlertConfig = $state('');

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		isLoading = true;
		errorAlertConfig = '';

		try {
			const response = await signIn('credentials', {
				firstName,
				lastName,
				email,
				password,
				command: 'sign-up',
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
			errorAlertConfig = error?.message;
		}

		isLoading = false;
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

<form onsubmit={handleSubmit} class="flex w-full flex-col gap-4">
	<InputGroup let:Label let:Wrapper let:Input let:ErrorMessage>
		<Label className="text-white">First Name</Label>

		<Wrapper className="w-full">
			<Input
				tabindex={1}
				type="text"
				name="firstName"
				placeholder="Type your first name"
				autocomplete="name"
				title="Type your first name"
				bind:value={firstName}
				required
				class="border-gray-700 bg-white/10 text-white ring-gray-700 placeholder:text-gray-100"
			/>
		</Wrapper>
	</InputGroup>

	<InputGroup let:Label let:Wrapper let:Input let:ErrorMessage>
		<Label className="text-white">Last Name</Label>

		<Wrapper className="w-full">
			<Input
				tabindex={1}
				type="text"
				name="lastName"
				placeholder="Type your last name"
				autocomplete="name"
				title="Type your last name"
				bind:value={lastName}
				class="border-gray-700 bg-white/10 text-white ring-gray-700 placeholder:text-gray-100"
			/>
		</Wrapper>
	</InputGroup>

	<InputGroup let:Label let:Wrapper let:Input let:ErrorMessage>
		<Label className="text-white">E-mail</Label>

		<Wrapper className="w-full">
			<Input
				tabindex={2}
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
				tabindex={3}
				type={showPassword ? 'text' : 'password'}
				name="password"
				placeholder="**********"
				autocomplete="current-password"
				title="Type your password"
				bind:value={password}
				required
				class="border-gray-700 bg-white/10 text-white ring-gray-700 placeholder:text-gray-100"
			/>

			<button
				tabindex={4}
				type="button"
				aria-label={showPassword ? 'Hide password' : 'Show Password'}
				onclick={() => (showPassword = !showPassword)}
				class="absolute right-4 top-2/4 -translate-y-2/4"
				title={showPassword ? 'Hide password' : 'Show Password'}
			>
				{#if showPassword}
					<EyeOff class="text-white dark:text-gray-200" size={24} />
				{:else}
					<Eye class="text-white dark:text-gray-200" size={24} />
				{/if}
			</button>
		</Wrapper>

		<StrongPasswordModal setPasswordValue={(newPassword) => (password = newPassword)} />
	</InputGroup>

	<Button
		type="submit"
		class="w-full text-white"
		disabled={!(email && password) || isLoading}
		title={isLoading ? 'Loading...' : 'Sign In'}
	>
		{#if isLoading}
			<LoadingSpinning size={32} lineSize={2} color="white" />
		{:else}
			<UserPlus size={32} class="text-white" />
			Create Account
		{/if}
	</Button>
</form>
