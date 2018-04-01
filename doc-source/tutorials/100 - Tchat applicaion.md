Creating a tchat application in 15 minutes
==========================================

In this tutorial we will create a simple tchat application using eureca.io

----------


Prepating environement
----------------------

```
npm install eureca.io
npm install express
```


The tchat server
-----------------------
### Initialisation ###

First let's import node modules

```javascript
var express = require('express')
  , app = express(app)
  , server = require('http').createServer(app);
  
var EurecaServer = require('eureca.io').EurecaServer;
```

then we initialise eureca server object and serve a static page using express

```javascript
var eurecaServer = new EurecaServer({allow : ['tchat.welcome', 'tchat.send']});
 
//attach eureca to express server
eurecaServer.attach(server);
 
//serve index.html as default static file
app.get('/', function (req, res, next) {
 res.sendfile('index.html');
}); 
```


> **Note:**

>  eurecaServer object was initialised with **allow** parameter indicating that client side welcome() and send() methods can be called from server.
> Those allowed methods will be declared under "tchat" namespace in the client side (see client code). 


### Connections ###
For each connected we'll store a reference so we can call its methods later. This reference is deleted when the clien disconnect


```javascript
var connections = {};
 
eurecaServer.onConnect(function (connection) {
   console.log('New client ', connection.id, connection.eureca.remoteAddress);
   connections[connection.id] = {nick:null, client:eurecaServer.getClient(connection.id)};
});
 
eurecaServer.onDisconnect(function (connection) {    
    console.log('Client quit', connection.id);
    delete connections[connection.id];
});
```



### Authentication ###
Since this is just a tutorial, we will not check for real login/password here, instead we'll just check if the user indicated a non empty nick.

```javascript
//a namespace for chat methods on the server side
var tchatServer = eurecaServer.exports.tchatServer = {};
 
tchatServer.login = function (nick) {
 console.log('Client %s auth with %s', this.connection.id, nick);
 var id = this.connection.id;
 if (nick !== undefined) //here we can check for login/password validity for example
 {
  connections[id].nick = nick;  
  
  //tchat.welcome() is a client side function indicated that the client authentication is ok
  connections[id].client.tchat.welcome();
 }
}
```

### Broadcast messages ###
Last step is to add a method that will receive messages and send them to all connected clients

```javascript
    //clients will call this method to send messages
    tchatServer.send = function (message) {
     var sender = connections[this.connection.id];
     for (var c in connections) // just loop and send message to all connected clients
     {
      if (connections[c].nick) //if the client is not connected nick is null
       connections[c].client.tchat.send(sender.nick, message);
     }
    }
```

### Server ready ! ###
The server is now ready we just need to listen on some port 

```javascript
console.log('Eureca.io tchat server listening on port 8000')
server.listen(8000);
```

-------

The tchat client
----------------------

### HTML code ###
```html
    <!doctype html>
    <html>
     <head>
      <title>Eureca.io tchat</title>
      <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js" ></script>
      <script src="/eureca.js"></script>
     </head>
     <body>    
      <div id="auth">
       Pseudo : <input type="text" id="nick" /><button id="logBtn">Log In</button>
      </div>
      
      <div id="main" style="display:none">
       <ul id="msgbox"></ul>
       <input type="text" id="msg" /><button id="sendBtn">Send</button>
      </div>
      
      <script>
       var client = new Eureca.Client();
       /* all the following JS code comes here */
        
      </script>
     </body>
    </html>
```

### Get server reference ###
Once the client is ready, it receive a proxy allowing it to call server side functions. we'll store this variable for later use, and to check if we are connected to the server

```javascript
     var server;
     client.ready(function (proxy) {
      server = proxy;
     });
```


### Implement client side functions ###
As we saw earlier, the server calls two client functions : tchat.welcome() and tchat.send() ... here is how we implement them

```javascript
     var tchat = client.exports.tchat = {};
     
     tchat.send = function(nick, message)
     {
        var tchatline = $('<li><b>'+nick+' </b><span>'+message+'</span></li>');
        $('#msgbox').append(tchatline);
     }
     
     
     tchat.welcome = function()
     {
       $('#auth').fadeOut('fast', function() {
       $('#main').fadeIn('fast');
      });
     }
```

### DOM Stuff ###
In this part we generate a random client nick
we handle login button click event : call server side login() and sending client nick
we handle send button click event : send a message to the server so it can propagate it to all clients 

```javascript
     $('#nick').val('anonymous-'+new Date().getTime());
     
     $('#logBtn').click(function() {
      if (!server) return; //client not ready
      
      var nick = $('#nick').val();
      server.tchatServer.login(nick);
     });
     
     $('#sendBtn').click(function() {
      if (!server) return; //client not ready
      
      server.tchatServer.send($('#msg').val());
     });
```

### and finaly, some CSS :) ###
```css
 #msgbox {
  border:3px solid #555;
  height:300px;
  width:500px;
  overflow:auto;    
  list-style:none;
  padding:5px;    
 }
 #msgbox li {
  list-style:none;
  padding:0px;
  color:#55e;
  font:700 12px arial;
 }
 #msgbox li b {
  font:700 14px arial;
  color:#b33;
 }
 ```

Runing the tchat application
----------------------------------------
 To test the application, run the server using : node server.js (or better : node --harmony-proxies server.js) then go to this url http://localhost:8000/. 
