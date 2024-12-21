<script lang="ts">
	import colors from 'tailwindcss/colors';

	import LoadingDots from '$lib/components/ui/loading-dots.svelte';

	let { isSelectedContact }: { isSelectedContact: boolean } = $props();
</script>

<div class={`flex items-end ${isSelectedContact ? 'text-white' : 'text-purple-300'}`}>
	<span class="font-semibold">Typing</span>
	<span class="mb-[2px]">
		<LoadingDots size={4} color={colors.purple[300]} />
	</span>
</div>
