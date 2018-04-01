Getting started 
=============
This is a quick step by step guide to install and use eureca.io.

In this guide we will build a server, a browser client and a nodejs client.

The server defines two methods : 
 * echo(message) : will log a message
 * add(a,b) : will return a + b value 

The clients define two methods : 
* clientEcho(message) : which will show a message

----------


1 - Installing eureca.io
----------------------------

### **Server side**

```bash
npm install eureca.io
npm install engine.io
```

> **Note:**
> Bby default eureca.io use engine.io transport this is why we need to install it


#### Browser client
The browser client do not need further installation, the needed code is dynamically generated and exposed by the server.


#### Nodejs client
```bash
npm install eureca.io
npm install engine.io-client
```

> **Note:**
> since we are using engine.io in the server side, we'll need it's client counter part in the client side : engine.io-client


2 - Let's code !
------------------

We'll start with ...

### **Client side code**

There is only one main difference between nodejs client and browser client

**in browser client** we need to add a script in the headers

```javascript
    <head>
        <script src="/eureca.js"></script>
    </head>
```

**in nodejs client** we need to require eureca.io package
```javascript
var Eureca = require('eureca.io');
```

the rest of client side code is the same

we suppose that our server is listening on localhost port 8080

#### Step 1 : create eureca client
```javascript
var client = new Eureca.Client({uri: 'ws://localhost:8080/'});
```
> **Note:**
> in browser client you can  ommit uri parameter, eureca.io will guess it automatically.
> you can initialize the client like this : 
> var client = new Eureca.Client();
>
>This is not valid for nodejs client, where uri parameter is mandatory

#### Step 2 

**Export a function**
In the client side, functions under exports namespace can be called from the server side

```javascript
client.exports.clientEcho = function(msg) {
	console.log('Received ', msg);
}
```

**Wait for ready event and have fun**
before being able to call server side function, we need to wait for the client to be ready :

```javascript
client.ready(function (eproxy) {
    //call echo in the server side
    eproxy.echo('hello from browser client !');

   //call add and get result
   eproxy.add(5,10).onReady(function(r) {
	   console.log('5 + 10 = ', r);
   });
});
```

the client code is ready now let's write the ...

### **Server side code**

**Global setup**
here we'll write a server skeleton which will initialize an http server, listen to port 8080 and serve an index.html file 
this is not related to eureca.io, you can also use express.js to do this stuff ;)

```javascript
var http = require('http');
var fs = require('fs');
var server = http.createServer();

// == Eureca.io code goes here


// == end Eureca.io code


server.on('request', function (request, response) {
    
    if (request.method === 'GET') {
        
        if (request.url.split('?')[0] === '/') {
            var filename = __dirname + '/index.html';
            fs.readFile(filename, function (err, data) {
                var text = data.toString();
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.write(text);
                response.end();
            });
        }
    }

});

server.listen(8080);

```

**Eureca.io code**

initialisation 

```javascript
var Eureca = require('eureca.io');

//create eureca.io server with default parameters
//and tell eureca.io that the server is allowed to call clientEcho() function in the client side.
var eurecaServer = new Eureca.Server({allow:['clientEcho']});

//eureca.io need to be attached to an http server
eurecaServer.attach(server);
```
> **Note**
> the allow parameter is used to tell to the server to only recognize allowed client methods.
> if the client exports a method which is not declared in allow parameter, it'll not be accessible from the server.
> the client do not need to allow methods, because in such senarios, the client trust the server.


For each new connected client, call clientEcho()

```javascript
eurecaServer.onConnect(function(conn) {
	var client = eurecaServer.getClient(conn.id);
	client.clientEcho('Hello from server');
});
```

Export server side functions
```javascript
//eureca.io will expose all functions under .exports namespace to the client
eurecaServer.exports.echo = function (msg) {
    console.log('ECHO : ', msg);
}

// you can return results, they'll be sent back to the client, no need to deal with network stuff :)
eurecaServer.exports.add = function (a, b) {
	return a+b;
}

```


