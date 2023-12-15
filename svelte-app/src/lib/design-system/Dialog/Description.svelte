<script lang="ts">
	import { twMerge } from "tailwind-merge";

    export let tag: "span" | "p" = "span"

    export let className = ""
</script>

<svelte:element
    this={tag}
    class={twMerge('leading-6 dark:text-gray-200 text-gray-700 text-md', className)}
>
    <slot/>
</svelte:element>