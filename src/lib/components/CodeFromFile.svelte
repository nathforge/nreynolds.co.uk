<script lang="ts">
  import { codeToHtml } from "shiki";

  interface Props {
    content: string;
    lang?: string;
  }

  let { content, lang = "text" }: Props = $props();

  // Highlight code immediately (works during SSR)
  let html = codeToHtml(content, {
    lang,
    theme: "github-dark",
    defaultColor: false,
  }).then(html => html);
</script>

{#await html}
  <pre class="loading">Loading...</pre>
{:then highlightedHtml}
  {@html highlightedHtml}
{:catch error}
  <pre>Error highlighting code</pre>
{/await}

<style>
  .loading {
    padding: 1rem;
    background-color: #f9fafb;
    border-radius: 0.5rem;
    color: #6b7280;
  }
</style>
