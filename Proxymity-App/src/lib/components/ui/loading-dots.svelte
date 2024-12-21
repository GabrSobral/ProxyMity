<script lang="ts">
   type Props = {
      size?: number;
      color?: string;
   };

   type $$Props = Props;

   const { color = '#F12646', size = 56 } = $props() as Props;
</script>

<div class="flex space-x-[6px] justify-center items-center">
   <span class="sr-only">Loading...</span>
   <div
      style:width={`${size}px`}
      style:height={`${size}px`}
      style:background={color}
      class="rounded-full animate-bounce [animation-delay:-0.3s]"
   ></div>

   <div
      style:width={`${size}px`}
      style:height={`${size}px`}
      style:background={color}
      class="rounded-full animate-bounce [animation-delay:-0.15s]"
   ></div>

   <div style:width={`${size}px`} style:height={`${size}px`} style:background={color} class="rounded-full animate-bounce"></div>
</div>
