<script lang="ts">
  import Header from "$lib/components/Header.svelte";
  import { highlightCode } from "$lib/highlight";

  let cap = $state(30);
  let base = $state(2);
  let maxAttempts = $state(10);

  interface BackoffResult {
    attempt: number;
    delay: number | undefined;
    totalDelay: number | undefined;
  }

  let results = $derived(calculateBackoff(cap, base, maxAttempts));

  let codeString = $derived(
    `
const maxAttempts = ${maxAttempts};
for (let attempt = 0; attempt < maxAttempts; attempt++) {
  if (doSomething()) {
    break;
  }

  // Sleep between attempts.
  const isLastAttempt = attempt = maxAttempts - 1;
  if (!isLastAttempt) {
    sleep(min(${cap || 0}, ${base || 0} * 2 ** attempt))
  }
}`.trim(),
  );

  let highlightedCode = $state("");

  $effect(() => {
    highlightCode(codeString, "javascript").then((html) => {
      highlightedCode = html;
    });
  });

  function calculateBackoff(
    cap: number,
    base: number,
    attempts: number,
  ): BackoffResult[] {
    const results: BackoffResult[] = [];
    let totalDelay = 0;
    for (let attempt = 0; attempt < attempts; attempt++) {
      const delay = Math.min(cap, base * 2 ** attempt);
      totalDelay += delay;
      if (attempt === attempts - 1) {
        results.push({ attempt, delay: undefined, totalDelay: undefined });
      } else {
        results.push({ attempt, delay, totalDelay });
      }
    }
    return results;
  }

  function formatTime(seconds: number): string {
    if (seconds < 60) {
      return `${seconds.toFixed(2)}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const remainingSecondsStr =
      remainingSeconds === Math.round(remainingSeconds)
        ? remainingSeconds.toString()
        : remainingSeconds.toFixed(2);
    return `${minutes}m ${remainingSecondsStr}s`;
  }
</script>

<svelte:head>
  <title>⏱️ Exponential Backoff Calculator</title>
</svelte:head>

<div class="container mx-auto max-w-3xl px-4 py-8">
  <Header title="Exponential Backoff Calculator" />

  <div class="prose prose-lg max-w-none mb-12">
    <p>
      Calculate exponential backoff without jitter. See <a
        href="https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/"
        >the AWS post</a
      >.
    </p>
    {@html highlightedCode}
  </div>

  <form class="controls">
    <div class="form-group">
      <label for="cap">Cap (seconds)</label>
      <input id="cap" type="number" bind:value={cap} min="1" step="1" />
    </div>

    <div class="form-group">
      <label for="base">Base (seconds)</label>
      <input id="base" type="number" bind:value={base} min="1" step="0.1" />
    </div>

    <div class="form-group">
      <label for="maxAttempts">Max Attempts</label>
      <input
        id="maxAttempts"
        type="number"
        bind:value={maxAttempts}
        min="1"
        step="1"
      />
    </div>
  </form>

  <div class="results">
    <table>
      <thead>
        <tr>
          <th>Attempt</th>
          <th>Delay on failure</th>
          <th>Total delay on failure</th>
        </tr>
      </thead>
      <tbody>
        {#each results as result (result.attempt)}
          <tr>
            <td>{result.attempt}</td>
            <td>{result.delay ? formatTime(result.delay) : "n/a"}</td>
            <td>{result.totalDelay ? formatTime(result.totalDelay) : "n/a"}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  .controls {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    font-weight: 600;
    font-size: 0.9rem;
  }

  input[type="number"] {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    width: 150px;
  }

  .results {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  thead {
    background: #f5f5f5;
  }

  th,
  td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }

  th {
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 0.5px;
  }

  tbody tr:hover {
    background: #f9f9f9;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
</style>
