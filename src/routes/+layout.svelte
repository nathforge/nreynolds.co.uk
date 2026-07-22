<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import ContactNav from '$lib/components/ContactNav.svelte';

	let { children } = $props();

	const isHome = $derived(page.url.pathname === '/');
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if !isHome}
	<header class="border-b border-gray-100">
		<div class="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
			<a href="/" class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-lg font-semibold tracking-tight text-transparent hover:opacity-70">Nathan Reynolds</a>
			<ContactNav />
		</div>
	</header>
{/if}

{@render children()}
