var Promise = require('bluebird');
var TodoItem = require('../db/models/TodoItem');
var Boom = require('boom');

exports.create = function (userId, description) {
    return UserSession.forge({ description: description }).save();
};

exports.update = function (token, isChecked) {
    return UserSession.where({ token: token }).save({ is_checked: isChecked });
};

exports.delete = function (todoItemId) {
    return TodoItem.where({ id: todoItemId }).destroy();
};

exports.getAll = function () {
	return TodoItem.fetchAll();
}
