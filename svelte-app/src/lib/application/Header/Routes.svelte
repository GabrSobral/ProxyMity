<script lang="ts">
	import clsx from "clsx";
    import { page } from "$app/stores"
    
    import ChatCenteredText from "phosphor-svelte/lib/ChatCenteredText"

    let pathname = $page.url.pathname

    const pages = [
        {
            title: 'Chat',
            path: '/chat',
            icon:  ChatCenteredText,
        },
	];
</script>

<nav class="h-full flex items-center gap-4 min-h-[59px] max-h-[59px]">
    {#each pages as page (page.title)}
        <a 
            href={page.path} 
            data-sveltekit-preload-data="hover"
            class={clsx(
                'text-md font-medium tracking-wider hover:underline min-h-[59px] max-h-[59px] flex items-center relative pr-2',
                {
                    'dark:text-purple-300 text-purple-500': page.path === pathname,
                    'darK:text-gray-200 text-gray-700': page.path !== pathname,
                }
            )}    
        >
            <span class="flex items-center gap-2 h-full">
                <svelte:component this={page.icon} size={28} weight="fill"/>

                {page.title}
            </span>

            <div
                class={clsx('absolute h-1 rounded bg dark:bg-purple-300 bg-purple-500 bottom-0 m-auto transition-all', {
                    'w-0': page.path !== pathname,
                    'w-full': page.path === pathname,
                })}
            />
        </a>
    {/each}
</nav>