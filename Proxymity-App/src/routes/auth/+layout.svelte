<script lang="ts">
	let { children } = $props();
</script>

<main
	class="relative flex flex-1 flex-col items-center justify-center gap-4 bg-black bg-[url('/sign-background.svg')] bg-cover bg-no-repeat"
>
	<div
		class="mt-12 flex max-h-full w-96 flex-col gap-4 rounded-[1rem] bg-gray-800/40 p-4 shadow-lg ring-1 ring-gray-700 backdrop-blur-sm transition-all duration-300"
	>
		<header class="relative flex h-[80px] items-center justify-center">
			<img
				src="/Logo.svg"
				alt="ProxyMity Logo"
				width={170}
				height={170}
				class="absolute -top-[5rem]"
			/>
		</header>

		{@render children()}
	</div>

	<span class="text-gray-200">© {new Date().getFullYear()} ProxyMity. All rights reserved.</span>
</main>
