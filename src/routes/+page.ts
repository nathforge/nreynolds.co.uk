import { blogPosts } from "$lib/posts";

export const prerender = true;

export const load = async () => {
  const posts = await blogPosts.getAllPosts();

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    posts,
  };
};
