<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Nathan Reynolds</title>
</svelte:head>

<main class="mx-auto max-w-2xl px-4 py-16">
	<h1 class="inline-block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent">Nathan Reynolds</h1>

	<nav class="mt-4 flex gap-4 text-sm">
		<a href="https://github.com/nathforge" class="text-blue-600 hover:underline">GitHub</a>
		<a href="https://www.linkedin.com/in/nathan-reynolds-uk/" class="text-blue-600 hover:underline">LinkedIn</a>
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
