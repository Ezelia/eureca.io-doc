Returning values
==============
When you call an RPC function you may need to get back the result.
but since RPC implies network usage, you cannot just assign the call result to a variable.

**Example :**
We have a server exporting add function which add two numbers and returns a result.

```javascript
var server = new Eureca.Server();
server.exports.add = function(a, b) {
	return a + b;
}
```

now in the client side if you do this

```javascript
var client = new Eureca.Client();

client.ready(function(serverProxy) {
	var result = serverProxy.add(5,10);
});
```

the result value will not contain 5+10 because add function is an RPC call, and cannot return the result immediately!


What you need to do here is
```javascript
client.ready(function(serverProxy) {
	var result;
	serverProxy.add(5,10).onReady(function(r){ result = r});
});
```

onReady event is triggered when the server returns value to the remote caller and containt the returned value.

This is enought for most of usecases, but sometimes, the called function have nested callback or asynchronous operation, and the returned value is out of context.

let's say we have this server exported function
```javascript
server.exports.insertUser = function(username, alias) {
	do_some_stuff();
	insertDataToDB(username, alias, function() {
		//callback when the data is inserted

		//How to notify the caller about this ??
	})
	
	
}
```

How to notify the caller about data insertion ?
one trivial solution would be to call a remote function in the client side, to tell it that the operation succeeded ... but then if you have lot of insertions, you'll need to maintaint an identifier to know which operation succeeded ... this identifier need to be exchanged between client and server, and it's a technical data which have nothing to do with your business logic !


eureca.io provide you a simpler solution, allowing you to get back the result in onReady event.

and here's how 

we modify the server function

```javascript
server.exports.insertUser = function(username, alias) {
	var context = this;	
	context.async = true;
	
	do_some_stuff();
	insertDataToDB(username, alias, function() {
		//callback when the data is inserted

		context.return(1);
	});
	
	
}
```

Now in the client side
```javascript
client.ready(function(serverProxy) {
	serverProxy.insertUser('John','Doe')
	.onReady(function(r){ 
		if (r == 1) console.log('insertion OK');
		else console.log('insertion failed');
	});
});
```

**How does it work ?**
Exported functions have a special context which give you control on eureca.io behaviour.

Normaly, when a remote actor calls an exported function, eureca will send back the result as soon as the function is executed.

if you set async flag to true, you tell eureca to not send result, until this.return() is called.

This feature allow you to send nested asynchronous results to the caller without adding a specific function for this (like in our example).
but it can also used to override the returned value for example.



