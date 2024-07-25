<script lang="ts">
   import CallParticipantsContainer from '../components/call-participants/call-participants-container.svelte';
   import ChatContainer from '../components/chat-container/chat-container.svelte';
</script>

<svelte:head>
   <title>ProxyMity - Call</title>
</svelte:head>

<section class="flex flex-1 relative bg-[url('/sign-background.svg')] bg-no-repeat bg-cover p-2">
   <CallParticipantsContainer />
   <ChatContainer />
</section>
