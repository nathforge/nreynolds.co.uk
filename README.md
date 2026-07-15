# nreynolds.co.uk

Personal site built with SvelteKit and deployed to GitHub Pages at [www.nreynolds.co.uk](https://www.nreynolds.co.uk).

## Development

```sh
pnpm install
pnpm dev
```

## Deployment

Deployment is manual. The build runs locally so that [mmdr](https://github.com/MohammadRaziei/mmdr) can render Mermaid diagrams — install it with `pip install mmdr`.

```sh
pnpm ship
```

This builds the site and pushes the output to the `gh-pages` branch, which GitHub Pages serves.
