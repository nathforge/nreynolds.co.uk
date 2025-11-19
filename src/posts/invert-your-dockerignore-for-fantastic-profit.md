---
title: "⛴️ Invert your .dockerignore for great profit"
date: "2025-11-19"
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

On the left we're saying what we *don't* want in our image. It's what everyone
does.

On the right we're explicit about what we want.

## Who cares?

 1. **Easier to reason about**. If you care about any of the
    issues below, default ignore is the simplest solution. We have tools
    like [dive](https://github.com/wagoodman/dive) to diagnose image bloat
    but it's simpler if you don't have to.
 2. **Slow builds**. More content in your Docker context == slower builds.
 3. **Slow deployments**. When building, and when nodes pull images.
 4. **Improved security**. Depending on the stage of your company you might
    be pushing images from your laptop straight to prod. We've all been there.
    Can you be sure you're not pushing env files containing secret API keys?

<aside>
    <div>
        I can't say any of these are compelling enough to rewrite <code>.dockerignore</code>
        files. I've been doing it for new projects however and it works well.
    </div>
</aside>

**You will still need some ignore rules.** Python for example is a pain for
creating `__pycache__` directories. You can layer those on afterwards though.

Our tools don't make this easy. IDEs lowlight `.gitignore`-d files, but not
`.dockerignore`-d files.
