<script lang="ts">
	import type { PageData } from './$types';
	import ContactNav from '$lib/components/ContactNav.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Nathan Reynolds</title>
</svelte:head>

<main class="mx-auto max-w-2xl px-4 py-16">
	<h1 class="inline-block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent">Nathan Reynolds</h1>

	<div class="mt-4">
		<ContactNav />
	</div>

	<ul class="mt-12 space-y-4">
		{#each data.posts as post (post.slug)}
			<li>
				<a href="/blog/{post.slug}" class="group block rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-5 transition-shadow hover:shadow-md">
					<div class="flex items-baseline justify-between gap-4">
						<h2 class="text-xl font-semibold text-blue-600">{post.title}</h2>
						{#if post.date && !isNaN(new Date(post.date).getTime())}
							<time class="shrink-0 text-sm text-gray-500"
								>{post.date}</time
							>
						{/if}
					</div>
					{#if post.descriptionHtml}
						<p class="mt-1 text-gray-600">{@html post.descriptionHtml}</p>
					{/if}
				</a>
			</li>
		{/each}
	</ul>
</main>
