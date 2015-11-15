---
title: "Cape.JS 1.2 - Cape.JS Primer"
---

It has passed about a month from [the previous lecture](../15_deleting_task).
I thought I could release Cape.JS 1.2 soon at the time I wrote the article but I've noticed there are some "holes" of the spec since my co-workers and I actually use it. It's already updated for 16 times (!) since the first Release Candidate (RC) version.

Now, two new classes are introduced on Cape.JS 1.2.

* `ResourceAgent`
* `CollectionAgent`

Each one is the class to handle "resource" in the Rails terminology. For more information, I'll explain later of the next time, you can write JavaScript program that accesses REST API easier than ever by using them.

On this lecture, I'll explain how to upgrade Cape.JS to 1.2 of "Todo list" application you have created.

----

First update the server.(Rails) Open `Gemfile` on the text editor and rewrite the line starting from `gem 'rails'` as following.

```text
gem 'rails', '4.2.4'
```

In addition, rewrite the last line as following.

```text
gem 'sprockets-es6', '~> 0.7.0'
```

And then, run the next command on the terminal.

```text
$ bin/bundle update
```

<div class="note">
In actually, you can use Cape.JS 1.2 if you don't update them. In this opportunity, I hope you to update the version.
</div>

----

Next, update the front (JavaScript) side. Open `bower.json` on the text editor and rewrite it as following.

```json
{
  "name": "todo_list",
  "version": "0.1.0",
  "authors": [
    "Tsutomu Kuroda <t-kuroda@oiax.jp>"
  ],
  "license": "MIT",
  "ignore": [
    "**/.*",
    "node_modules",
    "bower_components",
    "vendor/assets/components",
    "test",
    "tests"
  ],
  "dependencies": {
    "capejs": "~1.2.0",
    "bootstrap": "=3.3.4",
    "es6-promise": "~3.0.2",
    "fetch": "~0.9.0",
    "fontawesome": "~4.4.0",
    "lodash": "~3.10.1"
  }
}
```

I rewrote `"versions": "0.0.0",` to  `"versions": "0.1.0",` on the third line. And then, I added the points to the section `"dependencies"` and update the version number of original one. The ones added are `es6-promise` and `fetch` and I'll explain their roles later. About original one, it updated the version of `capejs` to `~1.2.0` and upgrade each of `fontawesome` and `lodash`. But, about `bootstrap`, the newest 3.3.5 has bad chemistry with Sprockets so it stabilizes `=3.3.4` and the version.

Run the next command on the terminal.

```text
$ bower update
```

Now you can upgrade Cape.JS of "Todo list" application to 1.2.

----

I'll explain `es6-promise` and `fetch` added to the section `"dependencies"` of `bower.json`.

[es6-promise](https://github.com/jakearchibald/es6-promise) is "polyfill" for
the new function of ECMAScript 6 [Promise](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise)

<div class="note">
There is a case that a JavaScript library exists in order to realize the equal function that modern browsers (generally, the newest Chrome and Firefox) provide but other browsers (Internet Explorer and Safari) do not. It's called polyfill.
</div>

When you use Promise, it's easier to write the non-synchronous processing on JavaScript.

On the other hand, [fetch](https://github.com/github/fetch) is the polyfill for another new functional called as [Fetch API](https://developer.mozilla.org/ja/docs/Web/API/Fetch_API).

Fetch API is the new interface to acquire the resource beyond the network. It's an alternative to the [XMLHttpRequest](https://developer.mozilla.org/ja/docs/Web/API/XMLHttpRequest).

<div class="note">
jQuery calls Ajax request by using XMLHttpRequest in it. If it can uses Fetch API, it's not necessary to use jQuery for Ajax.
</div>

The class `ResourceAgent` and the class `CollectionAgent` introduced on Cape.JS 1.2 use this Fetch API in it. And, the polyfill `fetch` depends Promise.

----

From [the next lecture](../17_collection_agent1), I'll rewrite "Todo list" application by using the new function of Cape.JS 1.2.
