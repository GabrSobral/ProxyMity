<script lang="ts">
	import { signOut } from "@auth/sveltekit/client";

    import { Dialog } from "$lib/design-system/Dialog";
	import Button from "$lib/design-system/Button.svelte";
	import LoadingSpinning from "$lib/design-system/LoadingSpinning.svelte";

    export let closeModal: () => void;
    export let show: boolean;

    let isLoading = false;
</script>

<Dialog let:Title let:Description {closeModal} {show} className="max-w-[420px]">
    <Title>Are you leaving already?..</Title>
    
    <Description>
        If you logout, all your data saved data will be deleted, and you will must to Login again.
    </Description>

    <div class="flex gap-1 flex-wrap mt-2">
        <Button
            type="button"
            onClick={closeModal}
            tabIndex={0}
            isOutlined
            className="flex-1"
            disabled={isLoading}
            aria-disabled={isLoading}
        >
            Cancel
        </Button>

        <Button
            type="button"
            tabIndex={1}
            onClick={() => {
                isLoading = true
                signOut({ callbackUrl: '/auth/sign-in', redirect: true });
            }}
            className="flex-1"
            disabled={isLoading}
            aria-disabled={isLoading}
        >
            {#if isLoading}
                <LoadingSpinning size={32} lineSize={2} color="white" />
            {:else}
                Logout
            {/if}
        </Button>
    </div>
</Dialog>