<script lang="ts">
	import { User, X } from 'phosphor-svelte';
	import type { UserApi } from '../../../../../../types/user';

	export let user: UserApi;
	export let isSelected: boolean;
	export let removeAccount: () => void;
</script>

<li
	class="w-full relative py-2 px-3 rounded-xl flex gap-4 hover:opacity-90 group dark:bg-gray-900 bg-white transition-all shadow-md"
>
	<div
		class={`${
			isSelected ? 'w-full left-0 opacity-100' : 'w-0 left-2/4 opacity-10'
		} absolute h-full bg-gradient-to-r from-[#1C64CE] border-0 to-[#B809A6] transition-all rounded-xl top-0 z-0 duration-[0.3s] mx-auto`}
	/>
	<div class="relative min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px]">
		<div
			class="min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px] rounded-full z-0 shadow-xl flex items-center justify-center bg-gray-700"
		>
			<User size={20} class="text-white" />
		</div>
	</div>

	<div class={'flex flex-col gap-1 overflow-hidden w-full z-10'}>
		<span
			class={`${
				isSelected ? 'text-white' : 'text-gray-700 dark:text-gray-200'
			} truncate font-medium flex items-center justify-between gap-3 `}
		>
			{user.name}
		</span>

		<span class={`${isSelected ? 'text-white' : 'text-gray-500 dark:text-gray-400'} truncate text-sm`}>
			{user.email}
		</span>
	</div>

	<button
		type="button"
		title="remove account"
		class="absolute top-4 right-4 cursor-pointer z-10"
		on:click={removeAccount}
	>
		<X class="text-gray-700 dark:text-gray-200 transition-colors" size={24} />
	</button>
</li>
