<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';

	import { page } from '$app/stores';

	import { logError } from '../../../utils/logging';
	import LoadingSpinning from '$lib/components/ui/loading-spinning.svelte';

	let { children } = $props();

	let isSignInPage = $state($page.url.pathname.includes('sign-in'));
	let isProviderLoading = $state({
		github: false
	});

	$effect(() => {
		isSignInPage = $page.url.pathname.includes('sign-in');
	});

	async function oauthProvider(provider: 'github') {
		try {
			isProviderLoading.github = true;
			await signIn(provider, { redirect: true, callbackUrl: '/' });
		} catch (error: any) {
			logError(error);
		} finally {
			isProviderLoading.github = false;
		}
	}
</script>

<div class="relative flex w-full rounded-full bg-gray-900 shadow-inner transition-colors">
	<div
		data-signin={isSignInPage}
		data-signup={!isSignInPage}
		class="absolute top-2/4 z-20 h-[80%] w-[calc(50%-12px)] -translate-y-2/4 rounded-full bg-purple-500 shadow-lg transition-all duration-300 data-[signin=true]:left-[6px] data-[signup=true]:left-[calc(50%+6px)]"
	></div>

	<a
		tabindex="-1"
		href="/auth/login/sign-in"
		title="Log In Page"
		data-sveltekit-preload-data="hover"
		class="z-30 flex flex-1 items-center justify-center whitespace-nowrap rounded-[10px] p-3 text-lg font-medium tracking-widest text-white"
	>
		Log In
	</a>

	<a
		tabindex="-1"
		href="/auth/login/sign-up"
		title="Register page"
		data-sveltekit-preload-data="hover"
		class="z-30 flex flex-1 items-center justify-center whitespace-nowrap rounded-[10px] p-3 text-lg font-medium tracking-widest text-white"
	>
		Register
	</a>
</div>

<div class="flex flex-1 flex-col items-center justify-center overflow-hidden p-1">
	{@render children()}

	<div class="m-4 flex w-full flex-col gap-4">
		<span class="flex w-full items-center gap-2 whitespace-nowrap text-white">
			<div class="h-[1px] w-full bg-gray-500"></div>
			Or sign in with
			<div class="h-[1px] w-full bg-gray-500"></div>
		</span>

		<button
			onclick={() => oauthProvider('github')}
			type="button"
			title="Sign in with Github"
			disabled={isProviderLoading.github}
			class="flex w-full items-center justify-center gap-3 rounded-[8px] border border-gray-600 bg-black p-2 text-white transition-all hover:bg-gray-950 hover:brightness-125 disabled:cursor-progress disabled:opacity-50"
		>
			<svg
				width="26"
				height="25"
				viewBox="0 0 26 25"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M13.0108 0C5.81614 0 0 5.72914 0 12.8169C0 18.4825 3.7266 23.2783 8.89639 24.9757C9.54275 25.1033 9.77951 24.6999 9.77951 24.3606C9.77951 24.0634 9.7582 23.045 9.7582 21.9838C6.13892 22.7478 5.38524 20.4559 5.38524 20.4559C4.8036 18.9705 3.94179 18.5887 3.94179 18.5887C2.7572 17.8036 4.02808 17.8036 4.02808 17.8036C5.3421 17.8885 6.0316 19.1192 6.0316 19.1192C7.19461 21.0713 9.0687 20.5197 9.82265 20.1801C9.93024 19.3525 10.2751 18.7796 10.6413 18.4614C7.75468 18.1642 4.71758 17.0609 4.71758 12.1377C4.71758 10.7372 5.23424 9.59137 6.0529 8.70022C5.92374 8.382 5.47126 7.06612 6.18233 5.30493C6.18233 5.30493 7.2809 4.96534 9.75793 6.62055C10.8184 6.33999 11.9121 6.19727 13.0108 6.19607C14.1093 6.19607 15.2292 6.34477 16.2633 6.62055C18.7406 4.96534 19.8392 5.30493 19.8392 5.30493C20.5503 7.06612 20.0975 8.382 19.9683 8.70022C20.8086 9.59137 21.3039 10.7372 21.3039 12.1377C21.3039 17.0609 18.2668 18.1429 15.3586 18.4614C15.8327 18.8645 16.2417 19.6283 16.2417 20.8379C16.2417 22.5567 16.2204 23.9361 16.2204 24.3603C16.2204 24.6999 16.4575 25.1033 17.1035 24.9759C22.2733 23.278 25.9999 18.4825 25.9999 12.8169C26.0212 5.72914 20.1838 0 13.0108 0Z"
					fill="white"
				/>
			</svg>

			{#if isProviderLoading.github}
				<LoadingSpinning size={24} lineSize={2} color="white" />
			{:else}
				<span>GitHub</span>
			{/if}
		</button>
	</div>
</div>
