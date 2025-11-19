---
title: "🥂 Reverse engineering the Latitude app"
date: "2025-08-04"
---

**<a href="https://www.bbc.co.uk/news/uk-england-suffolk-38519169">The most middle class festival in Britain</a> happens to be my local.**

Latitude has a phone app with a schedule, but it's pretty tedious to use. Give me a spreadsheet already!

## To hacking

Android apps are simpler to reverse than iOS though I don’t have an Android phone.

So to start I [downloaded the Latitude festival xapk](https://latitude-greencopper.en.aptoide.com/app).

I used [apktool](https://apktool.org/) to decompile the xapk to [Smali code](https://pysmali.readthedocs.io/en/latest/api/smali/language.html). Note there’s an outer xapk, and another apk inside that. I ran `apktool d` on both. This gives something semi-readable to look at.

<aside>
    <div>
<a href="https://github.com/skylot/jadx">jadx</a> provides more readable Java output but it can’t decompile everything. Having both Smali and Java can be handy however.
    </div>
</aside>

I wanted to experiment with [frida-server](https://frida.re/docs/android/) - it’s a toolkit that lets you patch Android functions. Initially to monitor HTTPS traffic - I could maybe have used [mitmweb](https://www.mitmproxy.org/) but Frida came in handy later.

I [setup an Android emulator](https://developer.android.com/studio/run/emulator) - apparently they’re locked down these days and don’t let you use root. An API 26 image worked for me, there’s probably other options I’m not aware of.

I ran this to start the Frida server:

```shell
adb push frida-server /data/local/tmp/
adb shell "chmod 755 /data/local/tmp/frida-server"
adb shell "/data/local/tmp/frida-server &"
```

ChatGPT wrote this to log HTTP calls:

```javascript
Java.perform(function () {
    var URL = Java.use("java.net.URL");
    var HttpURLConnection = Java.use("java.net.HttpURLConnection");

    URL.$init.overload('java.lang.String').implementation = function (url) {
        console.log("[*] URL initialized with string: " + url);
        return this.$init(url);
    };

    HttpURLConnection.getOutputStream.implementation = function () {
        console.log("[*] HttpURLConnection.getOutputStream called");
        return this.getOutputStream();
    };

    HttpURLConnection.connect.implementation = function () {
        console.log("[*] Connecting to: " + this.getURL());
        return this.connect();
    };
});

```

Which I ran with:

```shell
while true; do
  uv run --with frida-tools frida -U -n Latitude -l hook.js
  sleep 0.5
done
```

This tried to hook the Latitude app every 0.5 seconds. This let me clear app data and restart the app, then Frida would jump in when the app started.

<aside>
🤫 <div>To reset the app state I ran <code>adb shell pm clear com.greencopper.android.latitude</code></div>
</aside>

Amongst other things it output https://content.greencopper.net/latitude-2025/9900587ec9b348da850a206f80ee39bd/content/content_v287.zip

This URL can't be found in the codebase, we'll see why soon.

## Encryption!

The content zip files were encrypted 👊.

Judicious use of Ctrl+F got me a Smali file containing the string “Password is blank. Please provide a valid password”. That sounds like a decryption function.

In Smali the decryption function was:
 * Class: `.class public final LIc/g;`
 * Method: `.method public final a(Ljava/io/File;Ljava/io/File;Ljava/lang/String;LXc/d;)Ljava/lang/Object;`

Asking ChatGPT to hook the function gave:

```javascript
Java.perform(function () {
    var TargetClass = Java.use("Ic.g");

    TargetClass.a.overload(
        "java.io.File",
        "java.io.File",
        "java.lang.String",
        "Xc.d"
    ).implementation = function(file1, file2, str, dObj) {
        console.log("🔤 password: " + str);
        return this.a(file1, file2, str, dObj);
    };
});
```

Ran the same way as the previous script, and…

Bingo! The logged password was `content_v287[redacted]zip`, where `[redacted]` is the `secret` value in `runConfig.json`

(`unzip` CLI couldn’t handle decrypting the file but `open content_v287.zip` did the trick.)

And we now have a decrypted content file with some JSON files containing schedules, performers, etc. 🙌

## Pre-packaged content

Remember the content zip URL? We couldn't find it in the codebase.

That's because the app has a content zip bundled into the APK, in the assets/content directory. It's encrypted, but we know how to workaround that now. The decrypted content contains links to other content manifests.
