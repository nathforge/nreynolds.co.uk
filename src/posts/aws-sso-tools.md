---
title: AWS SSO tools
date: 2026-07-22
description: |
  The goal: never run `aws sso login` again.
---

I love/hate `aws sso login`. From a security perspective, short-lived credentials are a massive benefit. From a UX perspective, they’re a pain.

[aws-sso-tools](https://github.com/nathforge/aws-sso-tools) are helpers to automatically run `aws sso login` just before you need it. There’s wrappers for the AWS CLI, for your own services, and for Docker pull/push.

Some neat features:
 * The commands are small units that you can plumb into your own tooling - e.g `should-login`, `login-showing-code`.
 * The login check is purely local which adds little overhead, parsing from `~/.aws/sso/cache`. e.g `should-login` takes 30ms on my machine.

Notable shortcomings:
 * Long-running services won't trigger another SSO login upon expiry - it only occurs on program invocation.
