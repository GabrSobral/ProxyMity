<script>
	import clsx from "clsx";
	import { Clock } from "phosphor-svelte";

</script>

<li
    onMouseOver={() => setIsMessageConfigVisible(true)}
    onMouseOut={() => setIsMessageConfigVisible(false)}
    class="flex flex-col gap-1  rounded-[1rem] w-full"
>
    <div
        class={clsx(
            'flex items-center gap-3 sticky dark:bg-gray-900 bg-white transition-colors p-1 px-2 rounded-full w-fit -top-3',
            {
                'ml-auto': isMine,
            }
        )}
    >
            <img
                src="https://github.com/diego3g.png"
                alt="User Photo"
                width={30}
                height={30}
                class="min-w-[30px] min-h-[30px] rounded-full z-0 shadow-xl"
            />
            <span class="dark:text-gray-200 text-gray-700 transition-colors text-xs">Diego</span>

        <span class="dark:text-gray-300 text-gray-700 transition-colors text-xs ml-2 flex items-center gap-2">
            {#if isMine && status === "wrote"}
                <Clock size={13} class="dark:text-gray-100 text-gray-600 transition-colors" />
            {:else}
                <div
                    title={status}
                    class={clsx('w-6 h-3 rounded-full flex items-center p-[2px] transition-all', {
                        'justify-end bg-transparent': status === 'sent',
                        'justify-end dark:bg-gray-600 bg-gray-300': status === 'received',
                        'justify-start bg-purple-500': status === 'read',
                    })}
                >
                    <div class="rounded-full w-2 h-2 bg-white transition-all" />
                </div>
            {/if}

            {timeToShow}
        </span>
    </div>

    <div class={clsx('flex items-center gap-2', { 'flex-row-reverse': isMine })}>
        <div
            class={clsx('w-fit rounded-[12px] text-white font-light text-sm shadow z-[13] p-1 min-w-[100px]', {
                'bg-gray-950 rounded-tl-none': !isMine,
                'bg-purple-500 rounded-tr-none': isMine,
            })}
        >
            {message.repliedMessage && (
                <div
                    class={clsx('dark:bg-black bg-white transition-colors p-2 rounded-[8px] w-full flex flex-col', {
                        'ml-auto': isMine,
                    })}
                >
                    <span class="text-purple-300 text-xs">{'Typescript'}</span>
                    <span class="text-gray-200 text-sm">
                        {typeof message.repliedMessage === 'object' ? message.repliedMessage?.content : null}
                    </span>
                </div>
            )}
            <p class="p-1">{message.content}</p>
        </div>

        {isMessageConfigVisible && (
            <button
                class="p-2 bg-gray-700 shadow-lg z-10 rounded-full"
                onClick={() => setReplyMessageFromConversation({ conversationId: message.conversationId, message })}
            >
                <ShareFat size={16} color="white" weight="fill" />
            </button>
        )}
    </div>
</li>