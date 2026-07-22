import { marked } from 'marked';

interface PostMetadata {
	title: string;
	date: string;
	description: string;
}

interface PostModule {
	metadata: PostMetadata;
}

export const load = async () => {
	const modules = import.meta.glob<PostModule>('/src/posts/*.md', { eager: true });

	const posts = Object.entries(modules)
		.map(([path, mod]) => {
			const slug = path.split('/').pop()!.replace('.md', '');
			const m = mod.metadata;
			const errors: string[] = [];
			if (!m?.title) errors.push('missing title');
			if (!m?.description) errors.push('missing description');
			if (!m?.date || isNaN(new Date(m.date).getTime())) errors.push('missing or invalid date');
			if (errors.length) {
				const msg = `[blog] ${slug}: ${errors.join(', ')} in frontmatter`;
				if (import.meta.env.DEV) throw new Error(msg);
				console.warn(msg);
			}
			return {
				slug,
				...mod.metadata,
				date: new Date(m.date).toISOString().slice(0, 10),
				descriptionHtml: m?.description ? marked.parseInline(m.description) as string : ''
			};
		})
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return { posts };
};
