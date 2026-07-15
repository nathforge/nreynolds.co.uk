<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const PostComponent = $derived(data.PostComponent);
</script>

<svelte:head>
	<title>{data.metadata.title}</title>
	{#if data.metadata.description}
		<meta name="description" content={data.metadata.description} />
	{/if}
</svelte:head>

<main class="mx-auto max-w-2xl px-4 py-16">
	<a href="/" class="text-sm text-blue-600 hover:underline">← Home</a>

	<header class="mt-6 mb-10">
		<time class="text-sm text-gray-500">
			{new Date(data.metadata.date).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			})}
		</time>
		<h1 class="mt-2 text-3xl font-bold tracking-tight">{data.metadata.title}</h1>
		{#if data.metadata.description}
			<p class="mt-2 text-lg text-gray-600">{data.metadata.description}</p>
		{/if}
	</header>

	<article class="prose max-w-none prose-gray">
		<PostComponent />
	</article>
</main>
