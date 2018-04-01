What's eureca.io
==============
Eureca.io is a JavaScript RPC ([Remote Procedure Call](http://en.wikipedia.org/wiki/Remote_procedure_call)) Library


## Eureca.io actors
Eureca.io involves two main actors, a server and a client.

### The Server
eureca.io is the central element of eureca.io.
It contains the server side code, and is considered as the trusty entity.
The server maintains references to each connected client, and allow you to call client exported methods.



### The Client
eureca.io support two kinds of clients :

 * Browser client : Javascript running on a browser
 * Nodejs client : Javascript runnint on a nodejs script

The clients are able to call all server exported methods.


## Exports
Each eureca.io actor need to export functions to make them available for RPC.

Exporting functions is very simple, you only need to define them under "exports" namespace.

When the server exports a function, it's available to the client without further action.

when clients exporta function, it must be explicitly allowed in the server side.



## Transports
Eureca.io can use various transport layers, this make it easy to switch from one library to another, compare performance and chose the right one.
Supported transports are : 

 * engine.io
 * sockjs
 * websocket 
 * Faye
 * browserchannel 
 * socket.io (legacy)

Above transport all relies ont XHR or websocket and are reliable transport, they are perfect for applications.
but eureca.io also support webRTC ! which can be used are reliable or unreliable transport making it ideal for games 

> **Note:** WebRTC support is still experimental and have a limitation, the server side WebRTC stack is only supported on linux throught [**wrtc**](https://github.com/js-platform/node-webrtc)


## Events
Each eureca.io actor expose events which allow you access high and low level features.

### Server events


### Client events


### Invoke events






