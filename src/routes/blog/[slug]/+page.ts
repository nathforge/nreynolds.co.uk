import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Component } from 'svelte';

interface PostModule {
	default: Component;
	metadata: {
		title: string;
		date: string;
		description?: string;
	};
}

export const load: PageLoad = async ({ params }) => {
	const modules = import.meta.glob<PostModule>('/src/posts/*.md');
	const loader = modules[`/src/posts/${params.slug}.md`];

	if (!loader) throw error(404, 'Post not found');

	const { default: PostComponent, metadata } = await loader();

	return { PostComponent, metadata };
};
