Deprecated syntax
=================

if you get one of the following errors

```bash
/!\  EurecaServer syntax is deprecated
```

```bash
/!\  EurecaClient syntax is deprecated
```

it means that you are using a deprecated.

Eureca.io v0.6.4 harmonized syntax across nodejs and browser javascript.

your old code which look like this

```javascript 
var EurecaServer = require('eureca.io').EurecaServer;
var eurecaServer = new EurecaServer();
```

```javascript 
var EurecaClient = require('eureca.io').EurecaClient;
var eurecaClient = new EurecaClient();
```

should be modified to this 

```javascript 
var Eureca = require('eureca.io');
var eurecaServer = new Eureca.Server();
```

```javascript 
var Eureca = require('eureca.io');
var eurecaClient = new Eureca.Client();
```