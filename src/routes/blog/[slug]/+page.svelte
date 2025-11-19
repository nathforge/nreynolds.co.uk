<script lang="ts">
  let { data } = $props();
</script>

<svelte:head>
  <title>{data.metadata.title}</title>
  {#if data.metadata.description}
    <meta name="description" content={data.metadata.description} />
  {/if}
</svelte:head>

<article class="container mx-auto max-w-3xl px-4 py-8">
  <div class="mb-8">
    <a href="/" class="inline-block">
      <h1
        class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent"
      >
        Nathan Reynolds
      </h1>
    </a>
  </div>

  <header class="mb-8">
    <h1 class="mb-4 text-4xl font-bold">{data.metadata.title}</h1>
    <div class="flex items-center gap-2">
      <a href="/" class="text-blue-600 hover:underline">← Home</a>
      <span class="text-gray-400">·</span>
      <time class="text-gray-600">
        {new Date(data.metadata.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
    </div>
  </header>

  <div class="prose prose-lg max-w-none">
    {@render data.content()}
  </div>

  <footer class="mt-12 border-t pt-6">
    <a href="/blog" class="text-blue-600 hover:underline">← Back to all posts</a
    >
  </footer>
</article>

<style>
  :global(.prose) {
    color: #374151;
  }

  :global(.prose h1) {
    font-size: 2em;
    font-weight: bold;
    margin-top: 1em;
    margin-bottom: 0.5em;
  }

  :global(.prose h2) {
    font-size: 1.5em;
    font-weight: bold;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }

  :global(.prose h3) {
    font-size: 1.25em;
    font-weight: bold;
    margin-top: 1.25em;
    margin-bottom: 0.5em;
  }

  :global(.prose p) {
    margin-bottom: 1em;
    line-height: 1.75;
  }

  :global(.prose ul),
  :global(.prose ol) {
    margin-bottom: 1em;
    padding-left: 1.5em;
  }

  :global(.prose ul) {
    list-style-type: disc;
  }

  :global(.prose ol) {
    list-style-type: decimal;
  }

  :global(.prose li) {
    margin-bottom: 0.5em;
    display: list-item;
  }

  :global(.prose li > ul),
  :global(.prose li > ol) {
    margin-top: 0.5em;
    margin-bottom: 0;
  }

  :global(.prose pre) {
    background-color: #1f2937;
    color: #f9fafb;
    padding: 1em;
    border-radius: 0.375rem;
    overflow-x: auto;
    margin-bottom: 1em;
  }

  :global(.prose code) {
    background-color: #f3f4f6;
    color: #1f2937;
    padding: 0.125em 0.25em;
    border-radius: 0.25rem;
    font-size: 0.875em;
  }

  :global(.prose pre code) {
    background-color: transparent;
    color: inherit;
    padding: 0;
  }

  :global(.prose strong) {
    font-weight: bold;
  }

  :global(.prose em) {
    font-style: italic;
  }

  :global(.prose a) {
    color: #2563eb;
    text-decoration: underline;
  }

  :global(.prose a:hover) {
    color: #1d4ed8;
  }

  :global(.prose blockquote) {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.5em;
    border-left: 4px solid #e5e7eb;
    padding-left: 1em;
    font-style: italic;
    color: #6b7280;
    margin-bottom: 1em;
    white-space: pre-line;
  }

  :global(.prose blockquote::before) {
    content: "\201C";
    grid-column: 1;
    grid-row: 1;
    font-size: 2em;
    line-height: 1;
    font-style: normal;
    font-family: Georgia, serif;
  }

  :global(.prose blockquote > *) {
    grid-column: 2;
  }

  :global(.prose blockquote > :last-child) {
    margin-bottom: 0;
  }

  :global(.prose aside) {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1em;
    background-color: #f3f4f6;
    padding: 1em;
    margin-bottom: 1em;
    border-radius: 0.5rem;
  }

  :global(.prose aside .aside-icon) {
    grid-column: 1;
    grid-row: 1 / -1;
    font-size: 1.5em;
  }

  :global(.prose aside > :not(.aside-icon)) {
    grid-column: 2;
  }

  :global(.prose aside > :last-child) {
    margin-bottom: 0;
  }

  :global(.prose aside a) {
    color: #2563eb;
    text-decoration: underline;
    pointer-events: auto;
  }

  :global(.prose aside a:hover) {
    color: #1d4ed8;
  }

  :global(.prose hr) {
    margin-top: 2em;
    margin-bottom: 2em;
    border: none;
    border-top: 1px solid #e5e7eb;
  }

  :global(.prose .intro) {
    background: linear-gradient(135deg, #eff6ff, #f3e8ff);
    padding: 1.5em;
    border-radius: 0.5rem;
    font-size: 1.1em;
    font-weight: bold;
    margin-top: 2em;
    margin-bottom: 1.5em;
  }

  :global(.prose .intro > :last-child) {
    margin-bottom: 0;
  }
</style>
