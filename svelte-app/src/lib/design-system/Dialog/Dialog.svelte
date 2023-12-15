<script lang="ts">
    import { X } from "phosphor-svelte";
    import { afterUpdate } from "svelte";
	import { twMerge } from "tailwind-merge";
	import { browser } from "$app/environment";
	import { fade, scale } from "svelte/transition";

	import { portal } from "../../../utils/portal";

	import Title from "./Title.svelte";
	import Description from "./Description.svelte";

	export let show: boolean;
	export let className: string =  ""
    export let closeModal: () => void;
    export let showCloseButton = true;

    let internalShow = false;
    let dialog: HTMLDialogElement;

    afterUpdate(() => {
        internalShow = show 
    })

    if(browser) {
        document.addEventListener('keyup', (event) => {
            if ( event.key === "Escape" )   {
                closeModal();
            }
        })
    }

    const components = {
        Title,
        Description
    }
</script>

{#if internalShow}
<div class="relative z-30" use:portal>
    <div 
        transition:fade={{ duration: 200 }}
        class="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-[2px] transition-all" 
        aria-hidden="true"
        aria-label="Dialog background, click to close the dialog."
        on:click={closeModal}
    />

    <dialog
        transition:scale={{ start: 0.9, opacity: 0 }}
        bind:this={dialog}
        open={internalShow}
        aria-modal="true"
        class={twMerge(
            'fixed flex flex-col gap-2 max-w-[90%] overflow-hidden rounded-[1rem] bg-white dark:bg-gray-900 p-6 text-left shadow-xl top-2/4 -translate-y-2/4 mx-auto',
            className
        )}
    >
        {#if showCloseButton}
            <button 
                type="button" 
                on:click={closeModal} 
                title="Close modal" 
                class="absolute top-4 right-4"
                aria-keyshortcuts="Escape" 
            >
                <X size={24} class="dark:text-gray-200 text-gray-700" />
            </button>
        {/if}

        <slot {...components}/>
    </dialog>
</div>
{/if}