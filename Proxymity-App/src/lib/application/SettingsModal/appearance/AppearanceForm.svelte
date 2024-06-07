<script lang="ts">
   import Text from '$lib/design-system/Text.svelte';

   // import * as Select from '$lib/components/ui/select';
   // import * as RadioGroup from '$lib/components/ui/radio-group';

   import DarkPlaceholder from './components/DarkPlaceholder.svelte';
   import LightPlaceholder from './components/LightPlaceholder.svelte';
   import SystemPlaceholder from './components/SystemPlaceholder.svelte';

   import { appTheme, setTheme, setAppColor } from '../../../../contexts/theme/store';

   const mainColors = [
      { name: 'Default', hex: '#6b7280', value: 'gray' },
      { name: 'Purple', hex: '#9218DE', value: 'purple' },
      { name: 'Red', hex: '#F12646', value: 'red' },
      { name: 'Blue', hex: '#3b82f6', value: 'blue' },
      { name: 'Green', hex: '#4d7c0f', value: 'green' },
   ];

   let font: 'inter' = 'inter';
   let mainColor = mainColors[0];
</script>

<div class="space-y-8">
   <div class="flex flex-col">
      <!-- <Select.Root portal={null} selected={{ value: 'inter', label: 'Inter' }}>
         <div class="flex flex-col gap-1">
            <Select.Label class="text-md font-medium p-0">Font</Select.Label>
            <Text size="md">Set the font you want to use in the application</Text>
         </div>

         <Select.Trigger class="w-[17rem] flex items-center justify-between gap-3 mt-5">
            <Select.Value placeholder="Select a font" />
         </Select.Trigger>

         <Select.Content>
            <Select.Group>
               <Select.Item value="inter" label="Inter">Inter</Select.Item>
            </Select.Group>
         </Select.Content>
         <Select.Input name="favoriteFruit" />
      </Select.Root> -->
   </div>

   <!-- <RadioGroup.Root
      value={$appTheme}
      class="grid max-w-xl gap-8 pt-2"
      orientation="horizontal"
      onValueChange={value => setTheme(value)}
   >
      <div class="flex flex-col gap-1">
         <Label class="text-md font-medium p-0">Theme</Label>
         <Text size="md">Select the theme for the application.</Text>
      </div>

      <div class="grid max-w-xl grid-cols-3 gap-4">
         <Label for="system" class="[&:has([data-state=checked])>div]:border-primary">
            <RadioGroup.Item id="system" value="system" class="sr-only" />
            <SystemPlaceholder />
            <span class="block w-full p-2 text-center font-normal"> System </span>
         </Label>

         <Label for="light" class="[&:has([data-state=checked])>div]:border-primary">
            <RadioGroup.Item id="light" value="light" class="sr-only" />
            <LightPlaceholder />
            <span class="block w-full p-2 text-center font-normal"> Light </span>
         </Label>

         <Label for="dark" class="[&:has([data-state=checked])>div]:border-primary">
            <RadioGroup.Item id="dark" value="dark" class="sr-only" />
            <DarkPlaceholder />
            <span class="block w-full p-2 text-center font-normal"> Dark </span>
         </Label>
      </div>

      <RadioGroup.Input name="spacing" />
   </RadioGroup.Root>

   <RadioGroup.Root
      value="comfortable"
      class="grid max-w-md gap-8 pt-2"
      orientation="horizontal"
      onValueChange={value => setAppColor(value)}
   >
      <div class="flex flex-col gap-1">
         <Label class="text-md font-medium p-0">Main color</Label>
         <Text size="md">Select the color theme for the application.</Text>
      </div>

      <div class="flex gap-4 flex-wrap">
         {#each mainColors as color}
            <Label
               for={color.value}
               class="[&:has([data-state=checked])>div]:ring-purple-300 [&:has([data-state=checked])>div]:ring"
            >
               <RadioGroup.Item id={color.value} value={color.value} class="sr-only" />
               <div
                  class={`h-[2rem] w-[2rem] rounded-full cursor-pointer hover:brightness-90 transition-all`}
                  style:background-color={color.hex}
               />
               <span class="sr-only">{color.name}</span>
            </Label>
         {/each}
      </div>
      <RadioGroup.Input name="spacing" />
   </RadioGroup.Root> -->
</div>
