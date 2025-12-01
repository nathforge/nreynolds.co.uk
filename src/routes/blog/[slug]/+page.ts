import { error } from "@sveltejs/kit";
import type { ComponentType } from "svelte";

interface PostMetadata {
  title: string;
  date: string;
  description?: string;
}

interface PostModule {
  default: ComponentType;
  metadata: PostMetadata;
}

export const load = async ({ params }) => {
  const posts = import.meta.glob("/src/posts/*.svx");
  const postPath = `/src/posts/${params.slug}.svx`;

  if (!posts[postPath]) {
    throw error(404, `Post not found: ${params.slug}`);
  }

  const post = (await posts[postPath]()) as PostModule;

  return {
    content: post.default,
    metadata: post.metadata,
  };
};
