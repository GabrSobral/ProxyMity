<script lang="ts">
   export let src: string | undefined;
   export let username: string | undefined = 'Anonymous';

   function getInitials(name: string) {
      const hasSpace = name.indexOf(' ') !== -1;
      return name.substring(0, hasSpace ? 1 : 2) + (hasSpace ? name.charAt(name.lastIndexOf(' ') + 1) : '');
   }

   let initials = getInitials(username || 'Anonymous');
</script>

<div class="flex items-center justify-center z-10" title={username}>
   {#if src}
      <img {src} alt={username} class="size-9 min-w-[2.25rem] min-h-[2.25rem] rounded-full" />
   {:else}
      <span class="font-semibold text-lg">{initials}</span>
   {/if}
</div>
