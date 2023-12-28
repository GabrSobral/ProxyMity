<script lang="ts">
	import { onMount } from 'svelte';
	import { CaretDown } from 'phosphor-svelte';

	export let container: HTMLUListElement;

	let isVisible = false;

	onMount(() => {
		const handleScroll = () => {
			if (container) {
				const isScrolledToBottom = container.scrollHeight - container.clientHeight <= container.scrollTop + 1;
				isVisible = !isScrolledToBottom;
			}
		};

		container?.addEventListener('scroll', handleScroll);

		return () => {
			container.removeEventListener('scroll', handleScroll);
		};
	});

	function scrollToBottom() {
		container.scroll({
			top: container.scrollHeight,
			behavior: 'smooth',
		});
	}
</script>

{#if isVisible}
	<button
		type="button"
		title="Scroll to bottom"
		on:click|stopPropagation={scrollToBottom}
		class="absolute bottom-20 right-6 z-20 flex items-center justify-center bg-purple-400 outline-none focus:outline-purple-500 focus:ring-0 rounded-full min-w-[2.5rem] min-h-[2.5rem] max-w-[2.5rem] max-h-[2.5rem] mt-auto ml-auto p-2"
	>
		<CaretDown class="text-white" />
	</button>
{/if}
