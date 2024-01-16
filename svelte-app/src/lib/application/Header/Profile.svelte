<script>
    import { page } from "$app/stores"
	import { fly } from 'svelte/transition';
    import { createDropdownMenu, melt } from '@melt-ui/svelte';
	import { ArrowRight, Gear, Info, SignOut } from 'phosphor-svelte';


	import Text from "$lib/design-system/Text.svelte";
	import LogoutModal from "./LogoutModal.svelte";

    $: user = $page.data.session?.user;

    let showLogoutModal = false;

	const {
		elements: { trigger, menu, item, separator, arrow },
		builders: { createSubmenu, createMenuRadioGroup },
		states: { open },
	} = createDropdownMenu({
		forceVisible: true,
		loop: true,
	});

	const {
		elements: { subMenu, subTrigger },
		states: { subOpen },
	} = createSubmenu();

	const {
		elements: { radioGroup, radioItem },
		helpers: { isChecked },
	} = createMenuRadioGroup({
		defaultValue: 'Hunter Johnston',
	});

	const personsArr = ['Typescript', 'Python', 'Javascript'];
</script>

<div class="flex items-center gap-3">
    <div class="flex flex-col gap-1">
        <Text size="md">Good Morning, {user?.name}</Text>
        <Text size="sm" className="text-xs text-gray-300">
            {user?.email}
        </Text>
    </div>

    <button type="button" class="trigger" use:melt={$trigger} aria-label="Update dimensions">
        <span class="sr-only">User</span>
    </button>
    
    {#if $open}
        <div class="menu" use:melt={$menu} transition:fly={{ duration: 150, y: -10 }}>
            <div class="item" use:melt={$item}>
                About ProxyMity

                <div class="ml-auto pl-5"><Info class="text-white" size={18}/></div>
            </div>

            <div class="m-[5px] h-[1px] bg-gray-600" use:melt={$separator} />

            <div class="item !hidden md:!flex" use:melt={$subTrigger}>
                Profiles
                <div class="ml-auto pl-5">
                    <ArrowRight class="square-4" />
                </div>
            </div>

            {#if $subOpen}
                <div class="menu subMenu" use:melt={$subMenu} transition:fly={{ x: -50, duration: 150 }}>
                    <div class="text">People</div>
                    <div use:melt={$radioGroup}>
                        {#each personsArr as person}
                            <div class="item" use:melt={$radioItem({ value: person })}>
                                <div class="check">
                                    {#if $isChecked(person)}
                                        <div class="dot" />
                                    {/if}
                                </div>
                                {person}
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}

            <div use:melt={$separator} class="m-[5px] h-[1px] bg-gray-600" />

            <div class="item" use:melt={$item} on:m-click={() => { showLogoutModal = true }}>
                Settings
                <div class="ml-auto pl-5"><Gear class="text-white" size={18}/></div>
            </div>

            <div class="item" use:melt={$item} on:m-click={() => { showLogoutModal = true }}>
                Sign out
                <div class="ml-auto pl-5"><SignOut class="text-white" size={18}/></div>
            </div>

            <div use:melt={$arrow} />
        </div>
    {/if}

    <div class="relative">
        <!-- <SettingsModal show={showSettingsModal} closeModal={() => setShowSettingsModal(false)} /> -->
        <LogoutModal closeModal={() => { showLogoutModal = false}} show={showLogoutModal} />
    </div>
</div>

<style lang="postcss">
	.menu {
		@apply z-10 flex max-h-[300px] min-w-[220px] flex-col shadow-lg;
		@apply rounded-md bg-gray-700 p-1 shadow-neutral-900/30 lg:max-h-none;
		@apply ring-0 !important;
	}
	.subMenu {
		@apply min-w-[220px] shadow-md shadow-neutral-900/30;
	}
	.item {
		@apply relative h-6 min-h-[32px] select-none rounded-sm pl-6 pr-1;
		@apply z-20 text-gray-100 outline-none;
		@apply data-[highlighted]:bg-purple-500 data-[highlighted]:text-gray-100 transition-colors;
		@apply data-[disabled]:text-gray-300;
		@apply flex items-center text-sm leading-none;
		@apply ring-0 !important;
	}   
	.trigger {
		@apply inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-700;
		@apply text-gray-900 transition-colors hover:bg-white/90;
		@apply data-[highlighted]:ring-gray-400 data-[highlighted]:ring-offset-2 !important;
		@apply p-0 text-sm font-medium  data-[highlighted]:outline-none;
	}
	.check {
		@apply absolute left-2 top-1/2 text-gray-500;
		translate: 0 calc(-50% + 1px);
	}

	.dot {
		@apply h-[4.75px] w-[4.75px] rounded-full bg-purple-500;
	}


	.rightSlot {
		@apply ml-auto pl-5;
	}

	.icon {
		@apply h-[13px] w-[13px];
	}
	.check {
		@apply absolute left-0 inline-flex w-6 items-center justify-center;
	}
	.text {
		@apply pl-6 text-xs leading-6 text-purple-300;
	}
</style>
