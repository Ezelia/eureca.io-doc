Hello World
==========
The goal of this quick tutorial is to get an up and running eureca.io client/server in less than five minutes.

The client side is a webpage with one button, when clicked it call a server side function.

The server side run on nodejs and call a function in the client side each time a new client is connected.



----------


**Server side**
---------------------

### **installing eureca.io**

```bash
npm install eureca.io
npm install engine.io
```

> **Note:**
> Bby default eureca.io use engine.io transport this is why we need to install it


### **Server skeleton**

The following code, create an http server and serve index.html file when you visit http://localhost:8080/  (the index.html will contain client code)

There is no eureca.io stuff here, only pure nodejs code :)

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

### **Server side eureca.io stuff**

```javascript
// == Eureca.io code goes here
var Eureca = require('eureca.io');

//Create eureca server
//and allow it to call clientEcho remote function 
var eurecaServer = new Eureca.Server({allow:['clientEcho']});

//attach it to http server
eurecaServer.attach(server); 

//functions under exports namespace become callable from client side
eurecaServer.exports.serverEcho = function(msg) {
	console.log('Server received : ', msg);
}

//each time a client is connected we call
eurecaServer.onConnect(function(socket) {
	var client = socket.clientProxy; //get remote client ref
	
	//call remote clientEcho function 
	client.clientEcho('Hello from server');
})
// == end Eureca.io code
```

> **Note:** In the server side, you need to explicitly allow remote function you'll be able to call.

**Client side**
-------------------

###**Preparing client**

**index.html skeleton**

```html
<!doctype html>
<html>
    <head>
	<!-- init eureca.io -->
        <script src="/eureca.js"></script>
    </head>
    <body>    
	<button id="helloBtn">Say Hello</button>
	
        <script>
// == Eureca.io code goes here


// == end Eureca.io code
        </script>
    </body>
</html>
```

> **Note :** You need to add eureca.js script to your page to be able to use eureca.io, this script is dynamically served by eureca server.

### **Client side eureca.io stuff**

```javascript
// == Eureca.io code goes here

//note we don't need "allow" parameter here
var eurecaClient = new Eureca.Client();

//export the method to be called from the server
eurecaClient.exports.clientEcho = function(msg) {
	alert(msg);
}

//eureca client cannot issue remote calls before ready event.
//we need to wait for it
eurecaClient.ready(function(serverProxy) {
	var btn = document.getElementById('helloBtn');

	btn.onclick = function() {
		serverProxy.serverEcho('Hello from client');
	}
});

// == end Eureca.io code
```


**Test the code**
------------------------

Save the server code in a file called server.js
Save the client code in a file called index.html in same directory
Start the server 
```bash
node server.js
```

open a web browser and visit : http://localhost:8080/ 

if everything goes fine, you'll see an alert message saying "Hello from server".
and when you click on "Say Hello" button you see the server printing "Server received : Hello from client"


**Congratulations you made your first eureca.io code!**


