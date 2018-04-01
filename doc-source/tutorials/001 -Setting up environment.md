Seting up eureca.io environment
===============================

Depending on how you want to use eureca.io the installation may differ.
in fact, eureca.io support multiple transport layers, each one need its own nodejs packages, but none of them is installed by default with eureca.io.

You'll need to install the needed packages for each transport layer.

Don't worry, if you choose a transport layer and forget a package, you'll be warned on eureca startup about the missing dependencies.

In the browser client, you don't need to install anything, just add the following line in your HTML <head> tag

```html
<script src="/eureca.js"></script>
```


in the server side or nodejs client side you'll need to install additional packages depending on the used transport layer






WebRTC special case

WebRTC is supported thank's to wrtc package, which bring WebRTC stack to nodejs. but this package do not officially support windows.
so WebRTC will only be supported if you have a Linux server.

in the client side, WebRTC is supported by last versions of Chrome, Firefox and Opera.

