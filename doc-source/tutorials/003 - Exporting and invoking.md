Exporting and Invoking
=====================

Before being able to invoke a remote function you'll need to export it.

Additionally, the server need to explicitly allow client exported functions.

exporting a function is very simple, you only need to declare it under "exports" namespace eighther in the client or server instance.


## Exporting server functions

The following syntax will export add function.

```javascript
eurecaServer.export.echo = function(msg) {
	console.log(msg)
}
```

You can also export sub namespaces using this syntax.

```javascript
eurecaServer.export.maths = {
	add : function(a, b) {
		return a + b;
	},
	sub : function(a, b) {
		return a - b;
	}
}
```



## Invoking exported functions from a client

The client will be able to invoke the above function using the following syntax

```javascript

eurecaClient.ready(function(serverProxy) {

	serverProxy.echo('hello');
	
});

```
Note that the client cannot invoke server functions if he's not ready.

there are two ways to know if a the client if ready.

 1 - putting your code as a callback to ready event (like the example above)
 2 - checking the client ready state with isReady function
 
```javascript
if (eurecaClient.isReady())
	eurecaClient.serverProxy.echo('hello');

```


if a function was exported under a namespace, the hierarchy is preserved in the client side.


```javascript
client.ready(function(serverProxy) {
	serverProxy.maths.add(5,10);
	serverProxy.maths.sub(5,10);
});

```



## Exporting client functions

Eureca.io client function export is similar to server export, with one additional detail.

exporting a function in the client side is not enought to make it callable from the server.
you also need to allow it when instantiating the server.

let's suppose we have the following client side code


```javascript
eurecaClient.export.alert = function (msg) {
	alert(msg);
}

eurecaClient.export.ns = { 
	foo : function () {
		//some code
	},
	bar : function () {
		//some code
	}
}
```


### Invoking client exported functions from the server.


```javascript
var eurecaServer = new Eureca.Server({allow:['alert', 'ns.foo']})
eurecaServer.onConnect(function(socket) {
	var client = socket.client;
	
	//alert is available since it was allowed
	client.alert('hello'); //will show an alert in the client side with 'hello' message


	//foo was allowed so it can be called
	client.ns.foo(); // will execute foo() code in the client side.
	
	
	//bar was not allowed it cannot be called
	client.ns.bar(); // will throw an exception in the server side because the server was not allowed to call this function
	
});

```

> **Note :** to allow a function under a sub-namespace, you need to specify the namespace, in the above example we allowed 'ns.foo'



















