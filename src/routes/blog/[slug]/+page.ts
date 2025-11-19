import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
  const posts = import.meta.glob('/src/posts/*.md');
  const postPath = `/src/posts/${params.slug}.md`;

  if (!posts[postPath]) {
    throw error(404, `Post not found: ${params.slug}`);
  }

  const post = await posts[postPath]() as any;

  return {
    content: post.default,
    metadata: post.metadata
  };
};
