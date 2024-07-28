<script lang="ts">
   type Props = {
      size?: number;
      color?: string;
   };

   type $$Props = Props;

   const { color = '#F12646', size = 56 } = $props() as Props;
</script>

<div class="flex justify-center items-center h-screen">
   <div class="relative inline-flex">
      <div style:background={color} style:width={`${size}px`} style:height={`${size}px`} class="rounded-full"></div>
      <div
         style:background={color}
         style:width={`${size}px`}
         style:height={`${size}px`}
         class="rounded-full absolute top-0 left-0 animate-ping"
      ></div>
      <div
         style:background={color}
         style:width={`${size}px`}
         style:height={`${size}px`}
         class="rounded-full absolute top-0 left-0 animate-pulse"
      ></div>
   </div>
</div>
