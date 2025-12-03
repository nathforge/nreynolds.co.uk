<script lang="ts">
  import { codeToHtml } from "shiki";
  import { onMount } from "svelte";

  let { src, lang = "text" }: { src: string; lang?: string } = $props();

  let html = $state("");

  onMount(async () => {
    try {
      // Fetch the file content
      const response = await fetch(src);
      const code = await response.text();

      // Highlight with Shiki
      html = await codeToHtml(code, {
        lang,
        theme: "github-dark",
        defaultColor: false,
      });
    } catch (error) {
      console.error("Failed to load code file:", error);
      html = `<pre>Error loading file: ${src}</pre>`;
    }
  });
</script>

{#if html}
  {@html html}
{:else}
  <pre class="loading">Loading...</pre>
{/if}

<style>
  .loading {
    padding: 1rem;
    background-color: #f9fafb;
    border-radius: 0.5rem;
    color: #6b7280;
  }
</style>
