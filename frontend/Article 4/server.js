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
