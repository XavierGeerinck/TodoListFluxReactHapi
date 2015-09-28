# Creating a TODO Application from scratch in React.JS / Flux / Hapi (part 4)
# Writing the Backend
## 1. Introduction
In the 4th part of this tutorial series we will setup our backend. The backend it's task is to get the changes to our todolist and save them into a database.

## 2. Installing the dependencies and folder structure
Since we are talking about a fairly easy application, the database structure is pretty straightforward. We will need just 1 table that will save our todoitems.
We will also use bookshelf.js which is an ORM manager for node.js that will make our life easier and Postgres which is our database software.

So let's get started, first run `npm init` and fill in your parameters. This will create our package.json so that we can install dependencies.

Now run npm install --save for the following dependencies:

* bluebird (Promise manager)
* async (Let's us run async tasks, we will use this for seeding our database)
* bookshelf (our ORM)
* boom (Error handling from hapi)
* hapi (Http framework)
* joi (Route requirements and validation)
* knex (SQL builder)
* pg (Postgres adapter)
* require-all (Require a directory at once)

As a last dependency, install knex globally using: `npm install knex -g`. We will use this to run migrations and seeds.

Once you did this, create the following folder structure:

```
config
src/
    controllers/
    db/
        migrations/
        models/
        schemas/
        seeds/
        utils/
        index.js
    routes/
    services/
test/
index.js
knexfile.js
package.son
server.js
```

## 3. Creating the database structure
### 3.1. More initial configuration
We are now ready to work on our database structure. Let's first create a schema which will define our database. The schema is not the official way of creating migrations in Bookshelf, but it is the easiest to manage and adapt your database later on. We will also use a initial migration which will create this schema in the database.

Before we can start using our migration we will need to define everything in our knexfile. This file contains where our models, migrations and seeds are located. In our case we will just fill this in to let it point towards our config folder:

**knexfile.js**

```
var config = require('./config');
module.exports = config.database
```

in our config folder, let's create an index.js and some app_<env>.json files:

**index.js**

```
var defaultenv = 'dev';
var allowed = ['dev', 'stag', 'prod', 'test'];

var config;

if ((allowed.indexOf(process.argv[2]) === -1) && !process.env.NODE_ENV) {
    config = require(process.cwd() + '/config/app_dev');
} else {
    config = require(process.cwd() + '/config/app_' + (process.env.NODE_ENV || process.argv[2] || defaultenv));
}

module.exports = config;
```

**app_dev.json**

```
{
    "database": {
        "client": "postgresql",
        "connection": {
            "database": "todo_app",
            "user": "postgres",
            "password": "root",
            "port": 5432,
            "host": "localhost"
        },
        "pool": {
            "min": 2,
            "max": 10
        },
        "migrations": {
            "tableName": "knex_migrations",
            "directory": "./src/db/migrations"
        },
        "seeds": {
            "directory": "./src/db/seeds"
        }
    },
    "server": {
        "ip": "0.0.0.0",
        "port": 8000,
        "cors_client_origins": [ "*" ],
        "cors_headers": [ "Authorization", "Content-Type", "If-None-Match", "Bearer", "x-http-method-override" ],
        "cors_methods": [ "GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS" ],
        "cors_credentials": true
    }
}
```

you can see that index.js loads the .json file which is defined by the startup parameters. We got 4 different environments called staging, production, testing and development, but we will only use the dev default for now.

In the `src/db` folder create a filed called `index.js` where we will put the bookshelf loader in:

**index.js**

```
var config = require('../../config');
var knex = require('knex')(config.database);
var bookshelf = require('bookshelf')(knex);

// Load the registry plugin so that we register the models first
bookshelf.plugin('registry');

module.exports = bookshelf;
```

It is a fairly simple file which will just configure bookshelf to use the configs defined in our json config file. We will also load the registry plugin so that we are able to avoid circular references.

### 3.2. Finally coding our schema
Now it is time to start coding our schema. For that create a file called `schema.js` in the `src/db/schemas` folder:

**schema.js**

```
/**
 * This file contains the database layout, it has been abstracted so we got
 * a nice and simple overview of the database.
 */
var Schema = {
    todo_item: {
        id: { type: 'increments', nullable: false, primary: true },
        description: { type: 'text', unique: true, nullable: false },
        is_checked: { type: 'boolean', nullable: false, defaultTo: false, comment: 'Is the item completed?' },
        created_at: { type: 'dateTime', nullable: false },
        updated_at: { type: 'dateTime', nullable: true }
    }
}

module.exports = Schema;
```

All we need now is a migration that can create this schema, for that run knex migrate:make initial which will create a file in the `src/db/migrations` folder ending on `_initial.js`. In here put this content:

```
/**
* The first migration will make use of the schema defined in ../schemas/schema.js
*/
var Schema = require('../schemas/schema.js');
var async = require('async');
var Promise = require('bluebird');
var initDB = require('../utils/dbUtil');

exports.up = function(knex, Promise) {
    return new Promise(function (resolve, reject) {
        // Get the different tables
        var tables = Object.keys(Schema);

        // Loop through them
        async.forEach(tables, function (tableName, callback) {
            initDB.createTable(tableName, knex)
            .then(function (result) {
                callback(null, result);
            })
            .catch(function (err) {
                callback(err);
            });
        }, function (err) {
            if (err) {
                return reject(err);
            }

            return resolve();
        });
    })
};

exports.down = function(knex, Promise) {
    return new Promise(function (resolve, reject) {
        var tables = Object.keys(Schema);

        // We run drop on reverse to cheat the FK's
        async.forEach(tables.reverse(), function (tableName, callback) {
            initDB.dropTable(tableName, knex)
            .then(function (result) {
                callback(null, result);
            })
            .catch(function (err) {
                callback(err);
            });
        }, function (err) {
            if (err) {
                return reject(err);
            }

            return resolve();
        });
    });
};
```

This also uses a util file in the `src/db/utils` folder called `dbUtil.js`:

**dbUtil.js**

```
/**
* This file will initialize the database and it's tables
*/
var Schema = require('../schemas/schema.js');
var data = require('../seeds/data.json');
var Promise = require('bluebird');
var async = require('async');
var knex = require('../').knex;

exports.dropTable = function (tableName, knex) {
    knex = knex || require('../');

    return new Promise(function (resolve, reject) {
        knex.schema.hasTable(tableName)
        .then(function (exists) {
            // If table does not exist, resolve anyway
            if (!exists) {
                return resolve('TABLE DOES NOT EXIST');
            }

            return knex.schema.dropTable(tableName)
        })
        .then(function (result) {
            return resolve(result);
        })
        .catch(function (err) {
            return reject(err);
        });
    })
};

exports.seed = function () {
    // Deep copy since we will perform delete!
    var dbData = JSON.parse(JSON.stringify(data));
    var tables = Object.keys(data);

    return new Promise(function (resolve, reject) {
        async.eachSeries(tables, function (table, tableCallback) {
            async.eachSeries(dbData[table], function (record, recordCallback) {
                // Insert
                return knex(table)
                .insert(record)
                .then(function () {
                    recordCallback();
                });
            }, tableCallback);
        }, function (err) {
            if (err) {
                return reject(err);
            }

            return resolve();
        });
    });
}

exports.truncate = function () {
    // Get our tables reverse, that we we do not get foreign key problems
    var tables = Object.keys(Schema).reverse();

    return new Promise(function (resolve, reject) {
        async.eachSeries(tables, function (table, tableCallback) {
            knex.raw('TRUNCATE TABLE "' + table + '" CASCADE;').then(function() { tableCallback(); });
        }, function (err) {
            if (err) {
                return reject(err);
            }

            return resolve();
        })
    });
};

exports.createTable = function (tableName, knex) {
    // And create a table for each one
    return knex.schema.createTable(tableName, function (table) {
        // Init vars for the columnkeys
        var column;
        var columnKeys = Object.keys(Schema[tableName]);

        // For each columnkey, add it to the column definition
        columnKeys.forEach(function (key) {
            // Set the currentKey
            var currentKey = Schema[tableName][key];

            // Type handler
            if (currentKey.type === "text" && currentKey.hasOwnProperty("fieldtype")) {
                column = table[currentKey.type](key, currentKey.fieldtype);
            } else if (currentKey.type === "string" && currentKey.hasOwnProperty("maxlength")) {
                column = table[currentKey.type](key, currentKey.maxlength);
            } else {
                column = table[currentKey.type](key);
            }

            // Nullable handler
            if (currentKey.hasOwnProperty("nullable") && currentKey.nullable === true) {
                column.nullable();
            } else {
                column.notNullable();
            }

            // Primary key constraint
            if (currentKey.hasOwnProperty("primary") && currentKey.primary === true) {
                column.primary();
            }

            // Unique constraint
            if (currentKey.hasOwnProperty("unique") && currentKey.unique === true) {
                column.unique();
            }

            // Is unsigned
            if (currentKey.hasOwnProperty("unsigned") && currentKey.unsigned === true) {
                column.unsigned();
            }

            // FK contstraint
            if (currentKey.inTable && currentKey.hasOwnProperty("references")) {
                column.references(currentKey.inTable + '.' + currentKey.references);
            } else if (currentKey.hasOwnProperty("references")) {
                column.references(currentKey.references);
            }

            // Default value
            if (currentKey.hasOwnProperty("defaultTo")) {
                column.defaultTo(currentKey.defaultTo);
            }

            // Comment meta data
            if (currentKey.hasOwnProperty('comment')) {
                column.comment(currentKey.comment);
            }
        });
    });
};
```

We are now done with our schema, when you run `knex migrate:latest` it should create the schema in your database.

### 3.3. Creating seeds for the initial items
Since there is no fun in developing without good test data, we will create a seed. A seed is preset data that will inserted before each test and when we run it. This ensures us a developer that we got most test cases there, and that we can develop as efficient as possible.

Create 2 files in the `src/db/seeds` folder called `data.json` and `init.js` with the following content:

**data.json**

```
{
    "todo_item": [
        {
            "id": 1,
            "description": "Go do grocery shoppings",
            "is_checked": false,
            "created_at": "2015-08-08T08:58:43.000Z",
            "updated_at": "2015-08-08T08:58:47.000Z"
        },
		{
            "id": 2,
            "description": "Buy the book Algorithms 4th edition",
            "is_checked": false,
            "created_at": "2015-08-08T08:58:43.000Z",
            "updated_at": "2015-08-08T08:58:47.000Z"
        },
		{
            "id": 3,
            "description": "Get a coffee",
            "is_checked": false,
            "created_at": "2015-08-08T08:58:43.000Z",
            "updated_at": "2015-08-08T08:58:47.000Z"
        },
		{
            "id": 4,
            "description": "Finish the 5th part of this tutorial series",
            "is_checked": false,
            "created_at": "2015-08-08T08:58:43.000Z",
            "updated_at": "2015-08-08T08:58:47.000Z"
        },
		{
            "id": 5,
            "description": "A finished item",
            "is_checked": true,
            "created_at": "2015-08-08T08:58:43.000Z",
            "updated_at": "2015-08-08T08:58:47.000Z"
        }
    ]
}
```

**init.js**

```
var data = require('./data.json');
var async = require('async');
var dbUtil = require('../utils/dbUtil');

exports.seed = function(knex, Promise) {
    return dbUtil.truncate().then(dbUtil.seed);
};
```

You can now run `knex seeds:run` to install this data into your database.

### 3.4. Creating our models
We are almost done with our database structure, the only thing that we need is a bookshelf model that will be able to fetch our table from the database.

Create a file in the `src/db/models` folder called `TodoItem.js`. In here put this content:

**TodoItem.js**

```
var Bookshelf = require('../');

var TodoItem = Bookshelf.Model.extend({
    tableName: 'todo_item',
    hasTimestamps: true, // Define that we update the created_at and updated_at on change
});

module.exports = TodoItem;
```

We are now done and ready to start the controller and service coding.

## 4.1. Creating our server code
For the server bootstrap we can use this code:

**server.js**

```
'use strict';

var Hapi = require('hapi');
var http = require('http');
var https = require('https');
var config = require('./config');
var Promise = require('bluebird');

// Set max sockets to be open
http.globalAgent.maxSockets = Number.MAX_VALUE;
https.globalAgent.maxSockets = Number.MAX_VALUE;

// Create server
var server = new Hapi.Server(config.server.is_debug ? { debug: { request: ['error'] } } : {});
server.connection({
    host: config.server.ip,
    port: config.server.port,
    routes: {
        cors: {
            origin: config.server.cors_client_origins,
            headers: config.server.cors_headers,
            methods: config.server.cors_methods,
            credentials: config.server.cors_credentials
        }
    }
});

// Register all the routes
function registerRoutes() {
    var routes = require('require-all')(__dirname + '/src/routes/v1');

    Object.keys(routes).forEach(function (key) {
        server.route(routes[key]);
    });
}

// Register the plugins, routes and authentication strategy
server.register([
//    {
//        register: require(''),
//        options: {}
//    }
], function (err) {
    if (err) {
        throw err;
    }

    registerRoutes();
});

// Register routes
module.exports = server;
```

**index.js**

```
'use strict';

// Server require
var server = require('./server');
var config = require('./config');

// Start
server.start(function (err) {
    if (err) {
        throw err;
    }

    console.log('Server started on ' + config.server.ip + ':' + config.server.port);
    server.log(['info', 'server'], 'Server started on ' + config.server.ip + ':' + config.server.port);
});
```

## 4.2. Creating our TodoItem routes, controller and services
Now the real work begins, we will create our API routes and hook up the controllers to it.

Start by creating our first route file in the `src/routes/v1` folder called `todo.js`.

> Note that we use v1 so that we can create a versioning for our API

**todo.js**

```
var Joi = require('joi');
var TodoController = require('../../controllers/TodoController.js');

module.exports = [
    {
        method: 'POST',
        path: '/todo',
        config: {
            handler: TodoController.create,
            validate: {
                payload: {
                    description: Joi.string().required()
                }
            }
        }
    },
	{
        method: 'DELETE',
        path: '/todo/{id}',
        config: {
            handler: TodoController.delete
        }
    },
	{
        method: 'GET',
        path: '/todo',
        config: {
            handler: TodoController.getAll
        }
    },
	{
        method: 'PUT',
        path: '/todo/{id}',
        config: {
            handler: TodoController.update,
            validate: {
                payload: {
                    is_checked: Joi.boolean().required()
                }
            }
        }
    },

];
```

and for our controller:

**src/controllers/TodoController.js**

```
var Boom = require('boom');
var TodoService = require('../services/TodoService');

exports.create = function (request, reply) {
    todoService
    .create(request.payload.description)
    .then(function (todoItem) {
        return reply(todoItem);
    })
    .catch(function (err) {
        return reply(err);
    });
}

exports.delete = function (request, reply) {
	todoService
	.delete(request.params.id)
	.then(function (success) {
		return reply(success);
	})
	.catch(function (err) {
		return reply(err);
	});
}

exports.update = function (request, reply) {
	todoService
	.update(request.params.id, request.payload.is_checked)
	.then(function (todoItem) {
		return reply(todoItem);
	})
	.catch(function (err) {
		return reply(err);
	});
}

exports.getAll = function (request, reply) {
	todoService
	.getAll()
	.then(function (todoItems) {
		return reply(todoItems);
	})
	.catch(function (err) {
		return reply(err);
	});
}
```

Now we got the routes with the controllers connected, so the last thing we have to do is to create the service. The service it's task is to manage the interaction with the database.

**src/services/todoService.js**

```
var Promise = require('bluebird');
var TodoItem = require('../db/models/TodoItem');
var Boom = require('boom');

exports.create = function (userId, description) {
    return TodoItem.forge({ }).save();
};

exports.update = function (token, isChecked) {
    return TodoItem.where({ token: token }).save({ is_checked: isChecked });
};

exports.delete = function (todoItemId) {
    return TodoItem.where({ id: todoItemId }).destroy();
};

exports.getAll = function () {
    return TodoItem.fetchAll();
}
```

# 5. Finish
Now when you run node index.js, your server should be up and running and we are able to make API calls.

In the next part we will then hook our frontend up to this backend and make interactions possible with it.
