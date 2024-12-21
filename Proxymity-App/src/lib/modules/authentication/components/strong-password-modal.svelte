<script lang="ts">
	import { Eye, Key, Copy, Check, AlertCircle, EyeOff, RefreshCcw } from 'lucide-svelte';

	import * as Dialog from '$lib/components/ui/dialog';

	// export let setPasswordValue: (newPassword: string) => void;

	let { setPasswordValue }: { setPasswordValue: (newPassword: string) => void } = $props();

	let strongPassword = $state(generatePassword());
	let isPasswordVisible = $state(false);
	let isCopied = $state(false);

	let isModalOpened = $state(false);

	function generatePassword(): string {
		const passwordLength = 18;
		const charSet =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

		let password = '';
		for (let i = 0; i < passwordLength; i++) {
			const randomIndex = Math.floor(Math.random() * charSet.length);
			password += charSet[randomIndex];
		}

		return password;
	}

	function copyToClipboard() {
		navigator.clipboard.writeText(strongPassword);
		isCopied = true;

		setTimeout(() => {
			isCopied = false;
		}, 1000);
	}
</script>

<Dialog.Root controlledOpen={isModalOpened}>
	<Dialog.Trigger type="button" class="text-sm text-purple-300 underline-offset-2 hover:underline">
		Generate a strong password
	</Dialog.Trigger>

	<Dialog.Content class="max-w-[36rem]">
		<Dialog.Title>Generate a strong password</Dialog.Title>

		<Dialog.Description>
			A strong and random password helps protect your online accounts and personal information from
			cyber threats
		</Dialog.Description>

		<Dialog.Description>
			By using a mix of characters and symbols, you can reduce the risk of unauthorized access and
			identity theft.
		</Dialog.Description>

		<Dialog.Description>Protect yourself by choosing a strong password.</Dialog.Description>

		<Dialog.Description class="flex items-center gap-2 text-orange-400 dark:text-orange-300">
			<AlertCircle size={24} class="text-orange-400 dark:text-orange-300" />
			Don&lsquo;t forget to save this password before create your account!
		</Dialog.Description>

		<div
			class="mt-4 flex items-center justify-between rounded-[10px] bg-background p-2 px-4 shadow-inner brightness-90"
		>
			<strong class="text-[1.5rem] font-bold tracking-widest text-primary">
				{isPasswordVisible
					? strongPassword
					: strongPassword
							.split('')
							.map(() => '*')
							.join('')}
			</strong>

			<div class="flex items-center gap-3">
				<button
					type="button"
					onclick={() => {
						isPasswordVisible = !isPasswordVisible;
					}}
					title="Show password"
					class="flex w-fit items-center justify-center"
				>
					{#if isPasswordVisible}
						<EyeOff size={28} class="text-purple-300" />
					{:else}
						<Eye size={28} class="text-purple-300" />
					{/if}
				</button>

				<button
					type="button"
					onclick={() => {
						strongPassword = generatePassword();
					}}
					title="Regenerate the password"
					class="flex w-fit items-center justify-center transition-all active:scale-90"
				>
					<RefreshCcw size={28} class="text-purple-300" />
				</button>
			</div>
		</div>

		<div class="ml-auto flex gap-2">
			<button
				type="button"
				onclick={copyToClipboard}
				class="text-md border-1 group flex w-fit items-center gap-2 rounded-[6px] border-solid border-purple-500 p-2 px-3 tracking-wider text-purple-300 transition-all hover:bg-purple-500 hover:text-white"
			>
				{#if isCopied}
					<Check size={28} class="text-purple-300 group-hover:text-white" />
					Copied
				{:else}
					<Copy size={28} class="text-purple-300" />
					Copy
				{/if}
			</button>

			<button
				type="button"
				onclick={() => {
					setPasswordValue(strongPassword);
					isModalOpened = false;
				}}
				class="text-md border-1 flex w-fit items-center gap-2 rounded-[6px] border-solid border-green-400 p-2 px-3 tracking-wider text-green-400 transition-colors hover:bg-green-700 hover:text-white hover:dark:text-white"
			>
				<Key size={28} class="text-green-400" />
				Use this password
			</button>
		</div>
	</Dialog.Content>
</Dialog.Root>
