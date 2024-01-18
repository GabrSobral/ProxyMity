<script lang="ts">
   import { Skeleton } from '$lib/components/ui/skeleton';
</script>

<div class="flex items-center gap-4 p-2">
   <Skeleton class="h-12 w-12 min-h-[48px] min-w-[48px] rounded-full" />
   
   <div class="flex flex-col gap-3 w-full">
      <Skeleton class="h-4 w-full" />
      <Skeleton class="h-4 w-2/3" />
   </div>
</div>
