import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { createHighlighter } from 'shiki';
import remarkMermaid from './src/lib/plugins/remark-mermaid.ts';
import remarkCallout from './src/lib/plugins/remark-callout.ts';

const highlighter = await createHighlighter({
	themes: ['github-dark'],
	langs: [
		'javascript',
		'typescript',
		'svelte',
		'html',
		'css',
		'bash',
		'json',
		'markdown',
		'python',
		'rust',
		'go',
		'yaml',
		'sql',
		'plaintext'
	]
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.svx', '.md'],
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.svx', '.md'],
			remarkPlugins: [remarkCallout, remarkMermaid],
			highlight: {
				highlighter: (code, lang) => {
					const supported = highlighter.getLoadedLanguages();
					const useLang = lang && supported.includes(lang) ? lang : 'plaintext';
					return highlighter
						.codeToHtml(code, { lang: useLang, theme: 'github-dark' })
						.replace(/ tabindex="0"/g, '')
						.replace(/[{]/g, '&#123;')
						.replace(/[}]/g, '&#125;');
				}
			}
		})
	],
	kit: {
		adapter: adapter({ fallback: '404.html' })
	}
};

export default config;
