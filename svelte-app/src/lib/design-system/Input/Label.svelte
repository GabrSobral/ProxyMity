<script lang="ts">
	import { getContext } from "svelte";
	import type { Writable } from "svelte/store";
	import type { InputContextProps } from "./InputGroup.svelte";

    const context = getContext<Writable<InputContextProps>>("@design-system:inputContext")
</script>

<label class="text-white dark:text-gray-200 font-medium" for={$context.inputId} {...$$restProps}>
    <slot><!-- optional fallback --></slot>
</label>