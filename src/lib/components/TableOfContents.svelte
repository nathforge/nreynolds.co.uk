<script lang="ts">
  import { onMount } from "svelte";

  interface Heading {
    id: string;
    text: string;
    level: number;
  }

  let headings: Heading[] = $state([]);

  onMount(() => {
    // Find all headings in the article
    const articleHeadings = document.querySelectorAll(
      "article h2, article h3, article h4",
    );

    headings = Array.from(articleHeadings).map((heading) => ({
      id: heading.id,
      text: heading.textContent || "",
      level: parseInt(heading.tagName.substring(1)),
    }));
  });
</script>

{#if headings.length > 0}
  <nav class="toc">
    <ul class="toc-list">
      {#each headings as heading}
        <li class="toc-item toc-level-{heading.level}">
          <a href="#{heading.id}" class="toc-link">
            {heading.text}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
{/if}

<style>
  .toc {
    margin: 2rem 0;
    padding: 0.5em 1.5rem;
    background-color: #f9fafb;
    border-left: 4px solid #3b82f6;
    border-radius: 0.5rem;
  }

  .toc-title {
    margin: 0 0 1rem 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
  }

  .toc-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .toc-item {
    margin: 0.5rem 0;
  }

  .toc-level-2 {
    padding-left: 0;
  }

  .toc-level-3 {
    padding-left: 1rem;
  }

  .toc-level-4 {
    padding-left: 2rem;
  }

  .toc-link {
    color: #3b82f6;
    text-decoration: none;
    transition: color 0.2s;
  }

  .toc-link:hover {
    color: #2563eb;
    text-decoration: underline;
  }
</style>
