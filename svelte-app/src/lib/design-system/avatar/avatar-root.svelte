<script lang="ts" context="module">
   export type AvatarContextProps = {};
</script>

<script lang="ts">
   import { setContext } from 'svelte';

   setContext('avatar-context', {});
</script>

<slot><!-- optional fallback --></slot>
