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

 1. **Easier to reason about**. This is the main thing for me. We have tools like [dive](https://github.com/wagoodman/dive) to explore image bloat, perhaps we even run it once in a while. Or&hellip; use default deny and be explicit about what you want.
 2. **Faster builds**: less content in your Docker context makes for faster builds.
 3. **Quicker deployments** during build push and node pull.
 4. **Improved security** - less chance of unexpected files appearing in your images - e.g `.env`, `.git`

Our tools don't make it easy to manage Docker context bloat.<br>
It takes intentional effort that I'd prefer to avoid.
