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

<main class="mx-auto max-w-2xl px-4 py-8">
	<header class="mt-6 mb-10">
		{#if data.metadata.date && !isNaN(new Date(data.metadata.date).getTime())}
			<time class="text-sm text-gray-500">
				{data.metadata.date}
			</time>
		{/if}
		<h1 class="mt-2 text-3xl font-bold tracking-tight">{data.metadata.title}</h1>
		{#if data.descriptionHtml}
			<p class="mt-2 text-lg text-gray-600">{@html data.descriptionHtml}</p>
		{/if}
	</header>

	<article class="prose max-w-none prose-gray">
		<PostComponent />
	</article>
</main>
