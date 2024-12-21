<script lang="ts">
	import '../app.css';
	import '@fontsource-variable/inter';
	import { ModeWatcher } from 'mode-watcher';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';

	import { i18n } from '$lib/i18n';

	import { Toaster } from '$lib/components/ui/sonner';
	import ThemeContext from '../contexts/theme/context.svelte';

	import WebsocketContext from '$lib/modules/chat/contexts/websocket-context/websocket-context.svelte';
	// import CallContext from '$lib/modules/chat/contexts/call-context/call-context.svelte';

	let { children } = $props();
</script>

<ModeWatcher defaultMode="light" />

<ParaglideJS {i18n}>
	<ThemeContext>
		<WebsocketContext>
			<Toaster position="bottom-left" closeButton />

			{@render children()}
		</WebsocketContext>
	</ThemeContext>
</ParaglideJS>

<style>
	:global(body) {
		font-family: 'Inter Variable', sans-serif;
	}
</style>
