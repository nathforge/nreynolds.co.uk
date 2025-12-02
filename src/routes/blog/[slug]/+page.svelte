<script lang="ts">
  import Header from "$lib/components/Header.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.metadata.title}</title>
  {#if data.metadata.description}
    <meta name="description" content={data.metadata.description} />
  {/if}
</svelte:head>

<article class="container mx-auto max-w-3xl px-4 py-8">
  <Header
    title={data.metadata.title}
    subtitle={new Date(data.metadata.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}
  />

  <div class="prose prose-lg max-w-none">
    <data.content />
  </div>

  <footer class="footer mt-12 pt-6">
    <a href="/" class="text-blue-600 hover:underline">← Back to homepage</a>
  </footer>
</article>

<style>
  .footer {
    border-top: 1px solid #e5e7eb;
  }
</style>
