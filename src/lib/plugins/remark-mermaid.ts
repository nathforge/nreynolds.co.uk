import { execFileSync } from 'child_process';
import { existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { visit } from 'unist-util-visit';
import type { Root, Code } from 'mdast';

function findMmdr(): string {
	// Vite may not inherit the user's full shell PATH, so check common install
	// locations before falling back to whatever is on the system PATH.
	const candidates = [
		join(homedir(), 'bin', 'mmdr'),
		join(homedir(), '.cargo', 'bin', 'mmdr'),
		'/opt/homebrew/bin/mmdr',
		'/usr/local/bin/mmdr',
		'mmdr'
	];
	for (const p of candidates) {
		if (p === 'mmdr' || existsSync(p)) return p;
	}
	return 'mmdr';
}

const mmdrPath = findMmdr();

export default function remarkMermaid() {
	return (tree: Root) => {
		const blocks: Array<{ value: string; index: number; parent: Root }> = [];

		visit(tree, 'code', (node: Code, index, parent) => {
			if (node.lang === 'mermaid' && parent !== null && index !== undefined) {
				blocks.push({ value: node.value, index, parent: parent as Root });
			}
		});

		if (blocks.length === 0) return;

		for (const { value, index, parent } of blocks) {
			let html: string;
			try {
				const svg = execFileSync(mmdrPath, ['-e', 'svg'], {
					input: value,
					encoding: 'utf8',
					timeout: 15_000
				});
				html = `<figure class="not-prose my-6 flex justify-center overflow-x-auto">${svg}</figure>`;
			} catch (err) {
				const msg = err instanceof Error ? err.message : String(err);
				console.error(`[remark-mermaid] Failed to render diagram: ${msg}`);
				// Escape { and } so Svelte doesn't treat them as expression delimiters.
				const escaped = value.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
				html = `<pre class="not-prose text-sm text-red-400"><code>${escaped}</code></pre>`;
			}

			parent.children[index] = { type: 'html', value: html };
		}
	};
}
