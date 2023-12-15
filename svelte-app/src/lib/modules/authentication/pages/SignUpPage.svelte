<script lang="ts">
	import { goto } from "$app/navigation";
	import { signIn } from "@auth/sveltekit/client";
	import Eye from "phosphor-svelte/lib/Eye";
	import UserPlus from "phosphor-svelte/lib/UserPlus";
	import EyeClosed from "phosphor-svelte/lib/EyeClosed";

	import Button from "$lib/design-system/Button.svelte";
	import InputGroup from "$lib/design-system/Input/InputGroup.svelte";
	import LoadingSpinning from "$lib/design-system/LoadingSpinning.svelte";

	import WarningAlert from "../components/WarningAlert.svelte";
	import StrongPasswordModal from "../components/StrongPasswordModal.svelte";

    let email = ""
    let password = ""

    let showPassword = false;
    let isLoading = false;

    let isStrongPasswordModalVisible = false;
    let errorAlertConfig = ""

    async function handleSubmit() {
        isLoading = true;

		try {
			const result = await signIn('register', { name, email, password, redirect: false });
			isLoading = false;

            if(result?.ok) {
                goto('/chat');
            } else {
                console.error(result?.error);
    
                errorAlertConfig = result?.error;
                isLoading = false;
            }
		} catch (error: any) {
			console.log(error?.response?.data || error?.message);
			errorAlertConfig = error?.response?.data.message || error?.message;
			isLoading = false;
		}
	}
</script>

{#if errorAlertConfig}
    <WarningAlert
        errorMessage={errorAlertConfig} 
        closeAlert={() => { errorAlertConfig = "" }} 
    />
{/if}

<form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-4 w-full">
    <InputGroup let:Label let:Wrapper let:Input let:ErrorMessage>
        <Label>Name</Label>

        <Wrapper className="w-full">
            <Input 
                type="text"
                name="name"
                placeholder="Type your name"
                autoComplete="name"
                title="Type your name"
                value={email}
                required
                onChange={e => { email = e.target.value }}
                className="bg-gray-900 ring-gray-700 text-gray-200"
            />
        </Wrapper>
    </InputGroup>

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
                onChange={e => { email = e.target.value }}
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
                onChange={e => { password = e.target.value }}
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

        <button
            type="button"
            class="text-purple-300 text-sm hover:underline underline-offset-2"
            on:click={() => { isStrongPasswordModalVisible = true }}
        >
            Generate a strong password
        </button>
    </InputGroup>

    <StrongPasswordModal isVisible={isStrongPasswordModalVisible} closeModal={() => { isStrongPasswordModalVisible = false }}/>

    <Button
        type="submit"
        className="w-full"
        disabled={!(email && password) || isLoading}
        title={isLoading ? 'Loading...' : 'Sign In'}
    >
        {#if isLoading }
            <LoadingSpinning size={32} lineSize={2} color="white" />
        {:else}
            <UserPlus size={32} class="text-white" weight="light" />
            Create Account
        {/if}
    </Button>
</form>