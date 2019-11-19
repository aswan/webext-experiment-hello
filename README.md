# THIS REPOSITORY IS OBSOLETE

See [firefox source docs](http://firefox-source-docs.mozilla.org/toolkit/components/extensions/webextensions/index.html) for up to date information on WebExtensions experiments.

## Sample webextension experiment

This project contains a trivial example of a webextension experiment.

## Using an experimental API in 4 simple steps

1. Run a Firefox 51 build and navigate to [about:debugging](about:debugging)
2. Choose "Load Temporary Add-on" and select (a file from) the
   `experiment/` directory in this project.  You should see
   a new entry in the list of extensions titled "Experimental API".
3. Choose "Load Temporary Add-on" and select (a file from) the
   `extension/` directory in this project.  You should see a new entry
   in the list of extensions titled "hello test".
4. Click the "Debug" button next to "hello test" (you may need to
   enable debugging first).  When the console appears, you should see
   the string `hello sez: "Hello, world!"`.  That's it!  Read on for
   a more detailed explanation.

## Details

### The API extension

The extension in the [`experiment/`](experiment)
directory is a new type of Firefox extension called an api extension.
This is specified by the `type` property in
[the extension's install.rdf](experiment/install.rdf):

```
    em:type="256"
```

The rest of install.rdf is standard extension boilerplate with one
twist -- the extension id must be in the `something@somethingelse`
format (i.e., it may not be a UUID) and the portion before the at sign
is interpreted as the name of the API being created by this extension.
In this case, we are using the name "simple":

```
    em:id="simple@experiments.addons.mozilla.org"
```

To use this API, a webextension will need to declare that is requires
the `"experiments.simple"` permission -- more on that below.

An API extension must contain two files: `schema.json` and `api.js`.
The file [`schema.json`](experiment/schema.json)
is a standard JSON schema for the new
webextension API implemented in the extension.
When the API extension is loaded, the schema is loaded and processed
just like
[the schema files built into the base browser](https://dxr.mozilla.org/mozilla-central/source/toolkit/components/extensions/schemas).
In this case, we have a simple schema that creates
a new namespace called `hello`, which contains a single function `hello()`.

The file [`api.js`](experiment/api.js)
contains the actual implementation of this API.
This file is evaluated with Chrome privileges, and after it is evaluated,
it should create a new class called `API`.  A new instance of this
class will be created every time an extension that uses this API
(by declaring the permission described above).  This class should
include a method `getAPI()` that returns an object suitable for
being cloned into the `chrome` / `browser` objects visible to the
extension.

Like the built-in webextensions API implementations, functions
available to a webextension are wrapped with code generated from
the schema that validates permissions, function arguments, etc.
In this simple example, we have a single function `hello()` that just
returns a fixed string.

### The webextension

The webextension in the [`extension/`](extension) directory
is quite simple.
One thing to note is that [`manifest.json`](extension/manifest.json)
includes the permission `"experiments.simple"`.
As described above this creates a dependency between this webextension
and an API extension with an ID of the form `"simple@(something)"`.

The add-ons manager currently enforces this dependency in that it will
not enable a webextension if it depends on an API extension that is
not installed and active, but it does not attempt to install or enable
the API extension -- that must be done manually by the user.  If a
webextension depends on an API extension that is not available, the
webextension is simply disabled.

From here, the operation of the extension is pretty simple, it
includes a background script that calls the `hello()` function from
the API extension and logs the result to the console.

