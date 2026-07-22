---
title: AWS SSO tools
date: 2026-07-22
description: |
  The goal: never run `aws sso login` again.
---

I love/hate `aws sso login`. From a security perspective, short-lived credentials are a massive benefit. From a UX perspective, they’re a pain.

[aws-sso-tools](https://github.com/nathforge/aws-sso-tools) are some helpers to avoid running `aws sso login`. There’s wrappers for the AWS CLI, for your own services, and for Docker pull/push.

Some neat features:
 * Written in Rust for quick startup and small size.
 * Tools are small units so you can plumb them into your own tooling - e.g `aws-sso-should-login`, `aws-sso-login-showing-code`.
 * Uses the AWS SSO cache to validate logged-in-ness - no network calls required.
