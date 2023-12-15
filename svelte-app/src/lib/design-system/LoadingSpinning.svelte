<script lang="ts">
    export let size = 56;
    export let color = "#F12646";
    export let lineSize = 9;
</script>

<div
    style:width={`${size}px`}
    style:height={`${size}px`}
    style:border-radius="50%"
    style:background={`radial-gradient(farthest-side, ${color} 94%, #0000) top/${lineSize}px ${lineSize}px no-repeat, conic-gradient(#0000 30%, ${color})`}
    style:-webkit-mask={`radial-gradient(farthest-side, #0000 calc(100% - ${lineSize}px), #000 0)`}
    class="animate-spin spinner"
/>
