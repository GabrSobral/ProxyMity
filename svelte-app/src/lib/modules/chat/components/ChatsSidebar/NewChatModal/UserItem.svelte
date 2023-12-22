<script lang="ts">
	import Text from '$lib/design-system/Text.svelte';
	import { User } from 'phosphor-svelte';
	import type { UserApi } from '../../../../../../types/user';

	export let addAccount: () => void;
	export let user: UserApi;
</script>

<div
	role="button"
	tabindex={-1}
	on:click={addAccount}
	class="w-full relative py-2 px-3 rounded-xl flex gap-4 cursor-pointer hover:opacity-90 group dark:bg-gray-900 bg-white transition-all shadow-md"
>
	<div
		class={`absolute h-full bg-gradient-to-r from-[#1C64CE] border-0 to-[#B809A6] transition-all rounded-xl top-0 z-0 duration-[0.3s] mx-auto`}
	/>
	<div class="relative min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px]">
		<div
			class="min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px] rounded-full z-0 shadow-xl flex items-center justify-center bg-gray-700"
		>
			<User size={20} class="text-white" />
		</div>
	</div>

	<div class={'flex flex-col gap-1 overflow-hidden w-full z-10'}>
		<Text size="lg" className={`truncate font-medium flex items-center justify-between gap-3 `}>
			{user.name}
		</Text>
	</div>
</div>
