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
