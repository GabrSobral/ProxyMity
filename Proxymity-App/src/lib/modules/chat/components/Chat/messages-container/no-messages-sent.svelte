<script lang="ts">
	import Heading from '$lib/components/ui/heading.svelte';
</script>

<div class="pointer-events-none flex flex-1 flex-col items-center justify-center gap-3">
	<img src="/no-messages.svg" alt="No message" class="w-[15rem]" />
	<Heading size="md" class="opacity-80">No messages have been sent yet...</Heading>
</div>
