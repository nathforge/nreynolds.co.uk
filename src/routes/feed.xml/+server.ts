import { marked } from 'marked';

export const prerender = true;

interface PostMetadata {
	title: string;
	date: string;
	description: string;
}

interface PostModule {
	metadata: PostMetadata;
}

function xmlEscape(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export const GET = async () => {
	const modules = import.meta.glob<PostModule>('/src/posts/*.md', { eager: true });

	const posts = Object.entries(modules)
		.map(([path, mod]) => {
			const slug = path.split('/').pop()!.replace('.md', '');
			const m = mod.metadata;
			return {
				slug,
				title: m?.title ?? '',
				date: new Date(m?.date).toISOString(),
				descriptionHtml: m?.description ? (marked.parseInline(m.description) as string) : ''
			};
		})
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	const base = 'https://nreynolds.co.uk';
	const updated = posts[0]?.date ?? new Date().toISOString();

	const entries = posts
		.map(
			(post) => `
  <entry>
    <title>${xmlEscape(post.title)}</title>
    <link href="${base}/blog/${post.slug}"/>
    <id>${base}/blog/${post.slug}</id>
    <updated>${post.date}</updated>
    <summary type="html">${xmlEscape(post.descriptionHtml)}</summary>
  </entry>`
		)
		.join('');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Nathan Reynolds</title>
  <link href="${base}/feed.xml" rel="self" type="application/atom+xml"/>
  <link href="${base}/"/>
  <updated>${updated}</updated>
  <id>${base}/</id>${entries}
</feed>`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' }
	});
};
