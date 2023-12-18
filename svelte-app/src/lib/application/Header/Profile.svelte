<script>
    import { page } from "$app/stores"
	import Text from "$lib/design-system/Text.svelte";
	import LogoutModal from "./LogoutModal.svelte";

    $: user = $page.data.session?.user;

    let showLogoutModal = false;
</script>

<div class="flex items-center gap-3">
    <div class="flex flex-col gap-1">
        <Text size="md">Good Morning, {user?.name}</Text>
        <Text size="sm" className="text-xs text-gray-300">
            {user?.email}
        </Text>
    </div>

    <button type="button" on:click={() => { showLogoutModal = true }}>
        menu
    </button>

    <div class="relative">
        <!-- <SettingsModal show={showSettingsModal} closeModal={() => setShowSettingsModal(false)} /> -->
        <LogoutModal closeModal={() => { showLogoutModal = false}} show={showLogoutModal} />
    </div>
</div>