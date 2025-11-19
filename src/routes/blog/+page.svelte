<script lang="ts">
  let { data } = $props();
</script>

<div class="container mx-auto max-w-4xl px-4 py-8">
  <h1 class="mb-16 text-4xl font-bold">Blog</h1>

  <div class="space-y-6">
    {#each data.posts as post}
      <article class="border-b pb-6">
        <a href="/blog/{post.slug}" class="group">
          <h2 class="mb-2 text-2xl font-semibold group-hover:text-blue-600">
            {post.title}
          </h2>
          <time class="mb-2 block text-sm text-gray-600">
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          {#if post.description}
            <p class="text-gray-700">{post.description}</p>
          {/if}
        </a>
      </article>
    {/each}
  </div>
</div>
