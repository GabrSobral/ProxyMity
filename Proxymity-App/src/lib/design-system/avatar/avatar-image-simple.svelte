<script lang="ts">
   interface Props {
      src: string | undefined;
      username: string | undefined;
      size?: number;
   }
   type $$Props = Props;

   let { src, username = 'Anonymous', size = 36 } = $props() as Props;

   function getInitials(name: string) {
      const hasSpace = name.indexOf(' ') !== -1;
      return name.substring(0, hasSpace ? 1 : 2) + (hasSpace ? name.charAt(name.lastIndexOf(' ') + 1) : '');
   }

   let initials = getInitials(username || 'Anonymous');
</script>

<div class="flex items-center justify-center z-10" title={username}>
   {#if src}
      <img
         {src}
         alt={username}
         style:width={`${size}px`}
         style:height={`${size}px`}
         style:min-height={`${size}px`}
         style:min-width={`${size}px`}
         class={`rounded-full`}
      />
   {:else}
      <span class="font-semibold text-lg">{initials}</span>
   {/if}
</div>
