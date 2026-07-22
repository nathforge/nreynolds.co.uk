<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const email = 'email@nreynolds.co.uk';
	let showPopover = $state(false);
	let copied = $state(false);
	let copyTimeout: ReturnType<typeof setTimeout>;
	let wrapperEl: HTMLElement | undefined;

	function handleEmailClick(e: MouseEvent) {
		e.preventDefault();
		showPopover = !showPopover;
	}

	async function copyEmail(e: MouseEvent) {
		e.stopPropagation();
		await navigator.clipboard.writeText(email);
		copied = true;
		clearTimeout(copyTimeout);
		copyTimeout = setTimeout(() => {
			copied = false;
		}, 2000);
	}

	$effect(() => {
		if (!showPopover) return;
		function handleOutside(e: MouseEvent) {
			if (wrapperEl && !wrapperEl.contains(e.target as Node)) {
				showPopover = false;
			}
		}
		document.addEventListener('click', handleOutside);
		return () => document.removeEventListener('click', handleOutside);
	});
</script>

<svelte:head>
	<title>Nathan Reynolds</title>
</svelte:head>

<main class="mx-auto max-w-2xl px-4 py-16">
	<h1 class="inline-block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent">Nathan Reynolds</h1>

	<nav class="mt-4 flex gap-4 text-sm">
		<a href="https://github.com/nathforge" class="text-blue-600 hover:underline">GitHub</a>
		<a href="https://hachyderm.io/@nathforge" class="text-blue-600 hover:underline">Mastodon</a>
		<a href="https://www.linkedin.com/in/nathan-reynolds-uk/" class="text-blue-600 hover:underline">LinkedIn</a>
		<div class="relative" bind:this={wrapperEl}>
			<a href="mailto:{email}" onclick={handleEmailClick} class="text-blue-600 hover:underline">Email</a>
			{#if showPopover}
				<div class="absolute left-0 top-full z-10 mt-1 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">
					<a href="mailto:{email}" class="text-sm text-gray-800 hover:underline">{email}</a>
					<button
						onclick={copyEmail}
						class="ml-1 flex-shrink-0 text-gray-400 hover:text-gray-600"
						aria-label="Copy email address"
					>
						{#if copied}
							<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-green-500">
								<polyline points="20 6 9 17 4 12"></polyline>
							</svg>
						{:else}
							<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
								<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
							</svg>
						{/if}
					</button>
				</div>
			{/if}
		</div>
	</nav>

	<ul class="mt-12 space-y-4">
		{#each data.posts as post (post.slug)}
			<li>
				<a href="/blog/{post.slug}" class="group block rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-5 transition-shadow hover:shadow-md">
					<time class="text-sm text-gray-500"
						>{new Date(post.date).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						})}</time
					>
					<h2 class="mt-1 text-xl font-semibold text-blue-600">{post.title}</h2>
					{#if post.description}
						<p class="mt-1 text-gray-600">{post.description}</p>
					{/if}
				</a>
			</li>
		{/each}
	</ul>
</main>
