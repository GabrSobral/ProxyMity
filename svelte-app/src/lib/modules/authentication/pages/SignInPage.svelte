<script lang="ts">
    import { goto } from '$app/navigation';
    import { signIn } from "@auth/sveltekit/client"
	import Eye from "phosphor-svelte/lib/Eye";
	import SignIn from "phosphor-svelte/lib/SignIn";
	import EyeClosed from "phosphor-svelte/lib/EyeClosed";

	import WarningAlert from "../components/WarningAlert.svelte";

	import Button from "$lib/design-system/Button.svelte";
	import InputGroup from "$lib/design-system/Input/InputGroup.svelte";
	import LoadingSpinning from "$lib/design-system/LoadingSpinning.svelte";

    //#region States
    let email = ""
    let password = ""

    let showPassword = false;
    let isLoading = false;

    let errorAlertConfig = ""
    //#endregion

    //#region Functions
    async function handleSubmit() {
		isLoading = true;

        try {
            await signIn('credentials', { email, password, command: "sign-in", redirect: false });
    
            goto('/chat');
        } catch(error: any) {
            console.log({ error })

            errorAlertConfig = JSON.stringify(error);
        }

        isLoading = false;
	}
    //#endregion
</script>

{#if errorAlertConfig}
    <WarningAlert 
        errorMessage={errorAlertConfig} 
        closeAlert={() => { errorAlertConfig = "" }} 
    />
{/if}

<form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-4 w-full">
    <InputGroup let:Label let:Wrapper let:Input let:ErrorMessage>
        <Label>E-mail</Label>
    
        <Wrapper className="w-full">
            <Input 
                type="email"
                name="email"
                placeholder="Type your e-mail"
                autoComplete="email"
                title="Type your e-mail"
                value={email}
                required
                onInput={event => { email = event.target.value; }}
                className="bg-gray-900 ring-gray-700 text-gray-200"
            />
        </Wrapper>
    </InputGroup>

    <InputGroup let:Label let:Wrapper let:Input let:ErrorMessage>
        <Label>Password</Label>
    
        <Wrapper className="w-full">
            <Input 
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="**********"
                autoComplete="password"
                title="Type your password"
                value={password}
                required
                onInput={event => { password = event.target.value }}
                className="bg-gray-900 ring-gray-700 text-gray-200"
            />

            <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show Password'}
                on:click={() => showPassword = !showPassword}
                class="absolute right-4 -translate-y-2/4 top-2/4"
                title={showPassword ? 'Hide password' : 'Show Password'}
            >
                {#if showPassword}
                    <EyeClosed class="text-gray-200" size={24} />
                {:else}
                    <Eye class="text-gray-200" size={24} />
                {/if}
            </button>
        </Wrapper>
    </InputGroup>

    <Button
        type="submit"
        className="w-full"
        disabled={!(email && password) || isLoading}
        title={isLoading ? 'Loading...' : 'Sign In'}
    >
        {#if isLoading }
            <LoadingSpinning size={32} lineSize={2} color="white" />
        {:else}
            <SignIn size={32} class="text-white" weight="light" />
            Sign In
        {/if}
    </Button>
</form>
