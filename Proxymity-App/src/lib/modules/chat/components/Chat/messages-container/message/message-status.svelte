<script lang="ts">
	import { cn } from '$lib/utils';
	import { EMessageStatuses } from '../../../../../../../enums/EMessageStatuses';

	let { status } = $props<{ status: EMessageStatuses }>();
</script>

<div
	title={status ? status.toString() : '...'}
	class={cn(
		'flex h-3 w-6 items-center rounded-full bg-transparent p-[2px] shadow-lg transition-all',
		{
			'justify-end': status === EMessageStatuses.SENT,
			'justify-end bg-gray-600 ': status === EMessageStatuses.RECEIVED,
			'justify-start bg-purple-500': status === EMessageStatuses.READ
		}
	)}
>
	<div class="h-2 w-2 rounded-full bg-white transition-all"></div>
</div>
