<script lang="ts">
	import lottie from 'lottie-web';
	import Text from '$lib/components/ui/text.svelte';

	let element: HTMLElement | null = $state(null);

	$effect(() => {
		if (element) {
			lottie.loadAnimation({
				container: element, // the dom element that will contain the animation
				renderer: 'svg',
				loop: true,
				autoplay: true,
				// animationData: import.meta.url + '/no-messages-lottie.lottie' // the path to the animation json
				path: '/no-messages-lottie.json' // the path to the animation json
			});
		}
	});
</script>

<div class="m-auto flex flex-col gap-4">
	<div
		class="m-auto flex size-80 items-center justify-center rounded-full bg-background/20 p-8 shadow-md backdrop-blur-[3px]"
		bind:this={element}
	></div>

	<div class="z-10 mx-auto -mt-14 w-fit rounded-[2.5rem] bg-background p-4 px-5 shadow-md">
		<Text size="lg" class="mt-4 text-center">No chat was selected yet</Text>
	</div>
</div>
