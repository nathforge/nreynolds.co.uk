import { visit } from 'unist-util-visit';
import type { Root, Paragraph, PhrasingContent } from 'mdast';

const ICONS: Record<string, string> = {
	note: '📝',
	tip: '💡',
	warning: '⚠️',
	info: 'ℹ️'
};

function inlineToHtml(nodes: PhrasingContent[]): string {
	return nodes
		.map((n) => {
			if (n.type === 'text') return n.value;
			if (n.type === 'link')
				return `<a href="${n.url}">${inlineToHtml(n.children as PhrasingContent[])}</a>`;
			if (n.type === 'strong')
				return `<strong>${inlineToHtml(n.children as PhrasingContent[])}</strong>`;
			if (n.type === 'emphasis')
				return `<em>${inlineToHtml(n.children as PhrasingContent[])}</em>`;
			if (n.type === 'inlineCode') return `<code>${n.value}</code>`;
			return '';
		})
		.join('');
}

export default function remarkCallout() {
	return (tree: Root) => {
		visit(tree, 'paragraph', (node: Paragraph, index, parent) => {
			if (!parent || index === undefined) return;

			const first = node.children[0];
			if (first?.type !== 'text') return;

			// Match :::type at the start, e.g. ":::info\n"
			const match = first.value.match(/^:::(note|tip|warning|info)\n/);
			if (!match) return;

			const type = match[1];
			const children = [...node.children] as PhrasingContent[];

			// Strip ":::type\n" prefix from first child
			(children[0] as { value: string }).value = first.value.slice(match[0].length);

			// Strip trailing "\n:::" from last child
			const last = children[children.length - 1];
			if (last.type === 'text' && last.value.endsWith('\n:::')) {
				(children[children.length - 1] as { value: string }).value = last.value.slice(0, -4);
			}

			const inner = inlineToHtml(children);
			const icon = ICONS[type];

			parent.children[index] = {
				type: 'html',
				value: `<div class="not-prose callout callout-${type}"><span class="callout-icon">${icon}</span><div class="callout-body"><p>${inner}</p></div></div>`
			};
		});
	};
}
