# Builder
Tool for bundling code into userscripts with embeded metadata

### Example Usage
Create manifest.json file
```json
{
  "name": "XXXX",
  "namespace": "XXXX",
  "match": "XXXX",
  "icon": "XXXX",
  "description": "XXXX",
  "grant": "XXXX",
  "version": "XXXX",
  "author": "XXXX",
  "license": "XXXX"
}
```

Run builder on your entry point
```sh
builder -i src/index.ts -o dist/script.user.js -m manifest.json
```

And this is what builder produces
```js
// ==UserScript==
// @name           XXXX
// @namespace      XXXX
// @match          XXXX
// @icon           XXXX
// @description    XXXX
// @grant          XXXX
// @version        XXXX
// @author         XXXX
// @license        XXXX
// ==/UserScript==

// your code
...
```


### Full CLI Overview
```
Usage: builder [OPTIONS] -i <INPUT> -o <OUTPUT> -m <MANIFEST>

Options:
  -i, --input <INPUT>        entrypoint path
  -o, --output <OUTPUT>      build output path
  -m, --manifest <MANIFEST>  manifest file with required metadata

  --watch                    watch for changes

  --web                      serve file on a web server
  --open                     open server url in a web browser
  -p --port                  port number of the web server

  --no-build                 don't bundle the code, just embed the manifest.
                             it copies unmodified input with manifest at the top
                             into specified output

  -h, --help                 Display this help message
  -V, --version              Display current version
```
