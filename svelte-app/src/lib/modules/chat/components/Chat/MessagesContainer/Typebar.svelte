<script>
	import Button from '$lib/design-system/Button.svelte';
	import InputGroup from '$lib/design-system/Input/InputGroup.svelte';
	import { PaperPlaneTilt, X } from 'phosphor-svelte';

	let selectedConversation = {};

	let typeValue = '';

	async function sendMessage() {}
</script>

<div class="flex flex-col gap-2 m-1 mt-auto">
	<div class="w-full p-2 flex gap-2 bg-black rounded-lg">
		<div class="bg-gray-950 w-full p-2 rounded-md flex flex-col gap-1">
			<span class="text-purple-300 text-xs">{'Name'}</span>
			<span class="text-white text-sm">Conteudo de mensagem respondida</span>
		</div>

		<button
			type="button"
			title="Cancel reply message"
			on:click={() => /*removeReplyMessageFromConversation({ conversationId: selectedConversation?.id || ''  }) */ {}}
			class="ml-auto bg-gray-900 hover:brightness-125 flex items-center justify-center rounded-full max-w-[2.5rem] min-w-[2.5rem] max-h-[2.5rem] min-h-[2.5rem]"
		>
			<X size={24} color="white" />
		</button>
	</div>

	<InputGroup let:Input let:Label let:Wrapper className="flex w-full">
		<Label className="sr-only">Type a message</Label>

		<Wrapper className="w-full h-fit">
			<Input
				type="text"
				className="max-h-[20rem] min-h-[3.5rem] resize-none flex flex-1 py-3 focus:outline-none"
				placeholder="Type your message"
				bind:value={typeValue}
				autoFocus
				autoComplete="off"
			/>

			<Button
				tabIndex={2}
				type="button"
				title="Send message"
				onClick={sendMessage}
				className="p-2 absolute right-3 top-2/4 -translate-y-2/4 min-w-[2.75rem] min-h-[2.75rem] max-w-[2.75rem] max-h-[2.75rem] mt-auto rounded-[10px]"
			>
				<PaperPlaneTilt class="text-white" size={24} />
			</Button>
		</Wrapper>
	</InputGroup>
</div>
