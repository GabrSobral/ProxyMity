<script lang="ts">
   import Separator from '$lib/components/ui/separator/separator.svelte';
   import AppearanceForm from '../../../lib/modules/settings/pages/appearance/components/AppearanceForm.svelte';
</script>

<svelte:head>
   <title>Settings - Appearance</title>
</svelte:head>

<div class="space-y-6">
   <div>
      <h3 class="text-lg font-medium">Appearance</h3>
      <p class="text-sm text-muted-foreground">
         Customize the appearance of the app. Automatically switch between day and night themes.
      </p>
   </div>
   <Separator />

   <AppearanceForm />
</div>
