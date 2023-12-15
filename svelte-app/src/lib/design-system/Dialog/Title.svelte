<script lang="ts">
	import { twMerge } from "tailwind-merge";

    export let tag: "h1" | "h2" | "h3" = "h3"

    export let className = ""
</script>

<svelte:element
    this={tag}
    class={twMerge(
        'text-lg font-bold leading-6  dark:text-purple-300 transition-colors text-purple-500',
        className
    )}
>
    <slot/>
</svelte:element>