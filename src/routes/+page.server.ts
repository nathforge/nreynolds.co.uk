interface PostMetadata {
	title: string;
	date: string;
	description?: string;
}

interface PostModule {
	metadata: PostMetadata;
}

export const load = async () => {
	const modules = import.meta.glob<PostModule>('/src/posts/*.md', { eager: true });

	const posts = Object.entries(modules)
		.map(([path, mod]) => ({
			slug: path.split('/').pop()!.replace('.md', ''),
			...mod.metadata
		}))
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return { posts };
};
