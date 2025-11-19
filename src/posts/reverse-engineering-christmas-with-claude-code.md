---
title: "🎄 Reverse engineering Christmas with Claude Code"
date: "2025-11-19"
---

<img src="/hallmark.jpg" style="float: right; max-width: 200px; border-radius: 8px; margin-left: 2em">

<div class="intro">
    For marriage-related reasons I wanted a list of Hallmark Christmas movies.
</div>

- **Option 1**: copy/paste movie listings from one of several websites.
- **Option 2**: spend $20 on an LLM and *(1)* [boil a puddle](https://www.google.com/search?client=firefox-b-d&q=ai+is+boiling+the+ocean) ✊ *(2)* reverse engineer an Android app for fun.

<p>&nbsp;</p>

<img src="/pucking-fuddles.jpg" style="float: right; max-width: 200px; border-radius: 8px; margin-left: 2em">

**Given my aversion to unboiled puddles - *the choice is clear.*** Let’s grab the [Hallmark APK](https://www.google.com/search?q=hallmark+movie+checklist+apk+download) and have at it.

<aside>
<div class="aside-icon">❓</div>

Android apps are generally easier to reverse than the iOS equivalent. Open platform, bytecode, etc.

</aside>

<p>&nbsp;</p>

Here’s how I _would_ have done it:

- Unzip the `xapk`. This contains the `apk`, which is the interesting bit of the Android app.
- Run [apktool](https://apktool.org/) to disassemble bytecode to [Smali](https://www.google.com/search?q=smali+language).
- Read code.
- Ctrl+F.
- Think a lot.

<p>&nbsp;</p>

Here's what actually happened:

> Hey Claude, I want to reverse engineer this Android app for which I lost the source code 😉.
> The xapk is in this directory. Give me readable code to work with.

It output Java files! (I expected [Smali](https://www.google.com/search?q=smali+code) but it ran a [decompiler](https://github.com/skylot/jadx) 👌)

The files are obfuscated - minified names etc. That’s fine, it takes longer but no match for someone with plentiful free time.

_Or_ - a $20 subscription.

---

**Hey, Claude:**

> Find the API endpoints called from this decompiled Android app. Look for authentication
> methods.

- “POST auth/create - Register device”
- “GET app/franchise/`{id}` - Get franchise details”
- …

👍

<p>&nbsp;</p>

> _Dearest Claude_: Create an example typescript file demonstrating signup.
> My email is redacted@gmail.com.<br>
> You can suffix the username with “+” and a random number for testing.
> Run the signup script. Verify the signup endpoint returns a successful response.

Reader, **it smashed it**:

- “Good! The API responded. It's returning a 400 error because the field names are different. Let me look at the actual User entity structure and update the script”
- “The API expects name and surname instead of firstName and lastName”
- “The signup endpoint is working successfully! Let me create an enhanced version of the script with better documentation and add a confirmation script as well”

<hr/>

<aside>
<div class="aside-icon">🤔</div>
<div>
    Hallmark signup sends <a href="https://www.google.com/search?client=firefox-b-d&q=magic+link+auth">a magic link</a> for email confirmation.<br>
    It <em>also</em> includes the confirmation link in the signup API response - so it's trivial to bypass email confirmation.<br>
    
</div>
</aside>

> _Hey C-dog_: I noticed the signup API returns a confirmation URL. Can we use that to complete signup? Provide a script that does so.

- “I understand the structure. The confirmation body needs id, deviceId,
  and confirmationToken. Let me look for how to generate a device ID”
- “The confirmation worked (200 OK) but the response format is different.
  Let me check what we got back”
- “The script successfully obtained a working JWT access token valid for ~1 year, and
  verified it works by successfully calling the authenticated /app/settings endpoint.”

Neat.

<hr/>

> [That is fantastic, well done you](https://en.wikipedia.org/wiki/Roko%27s_basilisk). I've saved an access token to `token.txt`. Using this, can you write a script that lists movies?

tl;dr: Yes.

Very impressive.
