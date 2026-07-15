---
title: Invert your .dockerignore for great profit
date: 2025-11-12
description: 'Container registries hate this one weird trick.'
---

Here's something I use on personal projects:

`.dockerignore:`
```
*
!src
!package.json
!package-lock.json
!tsconfig.json
```

Notice that we ignore *everything* with `*`, then opt-in files via the `!` prefix.


## Why?

Prepending lines with `!` makes .dockerignore files opt-in, not opt-out. You're telling it what you want, not what you don't want.

With opt-out it’s easy to be forgetful. Does your `.dockerignore` contain `.git`? Have you added `node_modules`? `.env`? What could you have forgotten?

Opt-in is:
 1. **Easier to reason about**. This is the main thing for me. We have tools like [dive](https://github.com/wagoodman/dive) to explore image bloat, perhaps we even run it once in a while. Or&hellip; use opt-out and be explicit about what matters.
 2. **Faster builds**: less content in your Docker context makes for faster builds.
 3. **Quicker deployments** during build push and node pull.
 4. **Improved security** - less chance of unexpected files appearing in your images.

Our tools don't make it easy to manage Docker context bloat.<br>
It takes intentional effort that I'd prefer to avoid.
