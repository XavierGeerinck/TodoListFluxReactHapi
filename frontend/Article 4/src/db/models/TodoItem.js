var Bookshelf = require('../');

var TodoItem = Bookshelf.Model.extend({
    tableName: 'todo_item',
    hasTimestamps: true, // Define that we update the created_at and updated_at on change
});

module.exports = TodoItem;
