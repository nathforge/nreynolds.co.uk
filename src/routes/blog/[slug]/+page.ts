import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Component } from 'svelte';
import { marked } from 'marked';

interface PostModule {
	default: Component;
	metadata: {
		title: string;
		date: string;
		description: string;
	};
}

export const load: PageLoad = async ({ params }) => {
	const modules = import.meta.glob<PostModule>('/src/posts/*.md');
	const loader = modules[`/src/posts/${params.slug}.md`];

	if (!loader) throw error(404, 'Post not found');

	const { default: PostComponent, metadata } = await loader();
	const descriptionHtml = metadata.description ? marked.parseInline(metadata.description) as string : '';
	const date = new Date(metadata.date).toISOString().slice(0, 10);

	return { PostComponent, metadata: { ...metadata, date }, descriptionHtml };
};
