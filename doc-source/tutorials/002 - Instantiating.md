Instantiating
===========
eureca.io client and server instances can take different options which let you control their behaviour.


----------


**Server instantiation**
--------------------------------
The first thing you need to do is to import eureca package
```javascript
var Eureca = require('eureca.io');
```

### Default instantiation

**Code**

```javascript
var eurecaServer = new Eureca.Server();
```
This will instantiate eureca.io with default values, you will not be able to call any client side function but the client can call exported server functions.
It will use default transport library "engine.io"


### Allowing client side function

**Code**
```javascript
var eurecaServer = new Eureca.Server({allow:['foo', 'bar', 'echo']});
```
The above instantiation will allos the server to call the given client exported functions : foo(), bar() and echo() .


### Authentication functon
Eureca server can define an authentication function.
if present, the clients need to call client side authenticate function before being able to make server calls.


**Code**
```javascript
var eurecaServer = new Eureca.Server({
	authenticate:function (authToken, next) {        
			//your auth code goes here
			//
			if (success) next();
			else next('Auth failed');
		}
	});
```
See [Authentication tutorial](./tutorial-006 - Authentication.html) for more details on authentication usage


**Client instantiation**
------------------------

You can use eureca client from an html page (browser client) or from nodejs script (nodejs client)

there is a little different due to the nature of the client.

in a browser client you need to include eureca.js script in <head> tag

```html
<script src="/eureca.js"></script>
```

in a nodejs client you need to require eureca.io package
```javascript
var Eureca = require('eureca.io');
```




### Default instantiation

#### Browser client

```javascript
var eurecaClient = new Eureca.Client();
```
this works fine because browser client can guess eureca server uri.

but the recommanded syntax is :
```javascript
//supposing the server is running on localhost and port 8080 
var eurecaClient = new Eureca.Client({uri:'ws://localhost:8080/'});
```


#### Nodejs client


**Code**
```javascript
//supposing the server is running on localhost and port 8080 
var eurecaClient = new Eureca.Client({uri:'ws://localhost:8080/'});
```


> **Note :** in nodejs client you need to specify the server uri, otherwise the client will not be able to contact the server!
> This is not needed in browser client as it can guess the server uri, but still recommanded.





























