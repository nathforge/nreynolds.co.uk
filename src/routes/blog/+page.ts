export const load = async () => {
  const postFiles = import.meta.glob('/src/posts/*.md');
  const posts = await Promise.all(
    Object.entries(postFiles).map(async ([path, resolver]) => {
      const { metadata } = await resolver() as any;
      const slug = path.split('/').pop()?.replace('.md', '') || '';

      return {
        slug,
        ...metadata
      };
    })
  );

  // Sort posts by date (newest first)
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    posts
  };
};
