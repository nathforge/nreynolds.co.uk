import type { ComponentType } from "svelte";

export interface Post {
  slug: string;
  title: string;
  date: string;
  description?: string;
  content?: ComponentType;
}

export class Posts {
  private postFiles: Record<string, () => Promise<unknown>>;
  private directory: string;

  constructor(directory: string) {
    this.directory = directory;
    this.postFiles = import.meta.glob("/src/**/*.svx");
  }

  async getAllPosts(): Promise<Post[]> {
    const posts = await Promise.all(
      Object.entries(this.postFiles)
        .filter(([path]) => path.startsWith(this.directory))
        .map(async ([path, resolver]) => {
          const module = (await resolver()) as {
            metadata: { title: string; date: string; description?: string };
          };
          const slug = path.split("/").pop()?.replace(".svx", "") || "";

          return {
            slug,
            ...module.metadata,
          };
        }),
    );

    return posts;
  }

  async getPostBySlug(slug: string): Promise<Post | null> {
    const postPath = `${this.directory}/${slug}.svx`;

    if (!this.postFiles[postPath]) {
      return null;
    }

    const module = (await this.postFiles[postPath]()) as {
      default: ComponentType;
      metadata: { title: string; date: string; description?: string };
    };

    return {
      slug,
      content: module.default,
      ...module.metadata,
    };
  }
}

export const blogPosts = new Posts("/src/posts/blog");
