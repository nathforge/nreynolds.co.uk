<script lang="ts">
  interface Props {
    title: string;
    subtitle?: string;
  }

  let { title, subtitle }: Props = $props();
</script>

<div class="mb-8">
  <a href="/" class="inline-block">
    <h1
      class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent"
    >
      Nathan Reynolds
    </h1>
  </a>
</div>

<header class="mb-16">
  <h1 class="mb-4 text-4xl font-bold">{title}</h1>
  <div class="flex items-center gap-2">
    <a href="/" class="text-blue-600 hover:underline">← Home</a>
    {#if subtitle}
      <span class="text-gray-400">·</span>
      <span class="text-gray-600">{subtitle}</span>
    {/if}
  </div>
</header>
