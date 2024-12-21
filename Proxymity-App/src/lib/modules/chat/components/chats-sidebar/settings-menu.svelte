<script lang="ts">
	import { signOut } from '@auth/sveltekit/client';
	import { Github, LogOut, Menu, Settings, User } from 'lucide-svelte';

	import { buttonVariants } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class={buttonVariants({ variant: 'outline' })}>
		<Menu size={24} />
	</DropdownMenu.Trigger>

	<DropdownMenu.Content class="ml-3 w-56">
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>Options</DropdownMenu.GroupHeading>
			<DropdownMenu.Separator />
			<DropdownMenu.Group>
				<DropdownMenu.Item>
					<User class="mr-2 size-4" />
					<span>Profile</span>
				</DropdownMenu.Item>

				<DropdownMenu.Item>
					<Settings class="mr-2 size-4" />
					<span>Settings</span>
				</DropdownMenu.Item>
			</DropdownMenu.Group>

			<DropdownMenu.Separator />

			<DropdownMenu.Item>
				<Github class="mr-2 size-4" />
				<span>GitHub</span>
			</DropdownMenu.Item>

			<DropdownMenu.Separator />

			<DropdownMenu.Item onclick={() => signOut({ callbackUrl: '/auth/login/sign-in' })}>
				<LogOut class="mr-2 size-4" />
				<span>Log out</span>
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
