import { error } from "@sveltejs/kit";
import { blogPosts } from "$lib/posts";

export const load = async ({ params }: { params: { slug: string } }) => {
  const post = await blogPosts.getPostBySlug(params.slug);

  if (!post) {
    throw error(404, `Post not found: ${params.slug}`);
  }

  return {
    content: post.content,
    metadata: {
      title: post.title,
      date: post.date,
      description: post.description,
    },
  };
};
