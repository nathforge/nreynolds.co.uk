---
title: "⛴️ Invert your .dockerignore for great profit"
date: "2025-11-12"
---

Here are two .dockerignore files:

<div class="two-column">
  <section>

**Default allow** (old, busted)

```
data
node_modules
.dockerignore
.env
.env.example
.gitignore
.git
.prettierignore
.prettierrc
Dockerfile
eslint.config.js
mise.toml

```

  </section>
  <section>

**Default ignore** (new, saucy)

```
* # Ignore everything, except:
!src
!package.json
!package-lock.json
!tsconfig.json

```

  </section>
</div>

On the left we're saying what we *don't* want in our image. It's the default style.

On the right we're explicit about what we *do* want.

## Why?

 1. **Easier to reason about**.
 2. **Slow builds**. More content in your Docker context == slower builds.
 3. **Slow deployments**. Both during the build, and when nodes pull images.
 4. **Improved security**. Less chance of unexpected files appearing in your images.

**You will still need some ignore rules**, e.g for `__pycache__` directories. You can layer those on afterwards though.

Our tools don't make it easy to manage Docker context bloat. It takes intentional effort that I'd prefer to avoid.
