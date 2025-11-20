---
title: "🥂 Reverse engineering the Latitude app"
date: "2025-08-04"
---

<p style="font-size: 120%">
    <a href="https://www.latitudefestival.com/">Latitude Festival</a> has a phone app with a schedule, but it's pretty tedious to use. Give me a spreadsheet already!
</p>

## To hacking

Android apps are simpler to reverse than iOS, though I don’t have an Android phone.

I [setup an Android emulator](https://developer.android.com/studio/run/emulator) - apparently they’re locked down these days and it's trickier to get root. An API 26 image worked for me, there’s probably other options I’m not aware of.

I then [downloaded and installed the Latitude festival xapk](https://latitude-greencopper.en.aptoide.com/app).

Used [apktool](https://apktool.org/) to decompile the xapk to [Smali code](https://pysmali.readthedocs.io/en/latest/api/smali/language.html). There’s an outer `xapk` file, and an `apk` file inside that. I ran `apktool d` on both. This gives something semi-readable to look at.

<aside>
    <div>
<a href="https://github.com/skylot/jadx">jadx</a> provides more readable Java output but it can’t decompile everything. Having both Smali and Java can be handy however.
    </div>
</aside>

I wanted to experiment with [frida-server](https://frida.re/docs/android/) - it’s a toolkit that lets you patch Android functions. Initially to monitor HTTPS traffic - I could maybe have used [mitmweb](https://www.mitmproxy.org/), but Frida came in handy later.

Started the Frida server on the emulator:

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

This attempted to hook the Latitude app every 0.5 seconds. I could then clear app data and restart it, and Frida would patch the restarted app.

<aside>
🤫 <div>To reset the app state I ran <code>adb shell pm clear com.greencopper.android.latitude</code></div>
</aside>

Amongst other things it output https://content.greencopper.net/latitude-2025/9900587ec9b348da850a206f80ee39bd/content/content_v287.zip

This URL can't be found in the codebase, we'll see why soon.

## Encryption!

The content zip files were encrypted 👊.

Judicious use of Ctrl+F found a Smali file containing “Password is blank. Please provide a valid password”. That sounds like a decryption function.

In Smali the decryption function was:
 * Class: `.class public final LIc/g;`
 * Method: `.method public final a(Ljava/io/File;Ljava/io/File;Ljava/lang/String;LXc/d;)Ljava/lang/Object;`

Feeding this to ChatGPT and asking it to hook the function gave:

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

And we now have a decrypted content file with some JSON files containing schedules, performers, etc. 🙌

## Pre-packaged content

Remember the content zip URL? We couldn't find it in the codebase.

That's because the app has a content zip bundled into the APK, in the assets/content directory. It's encrypted, but we know how to workaround that now. The decrypted content contains links to other content manifests.
