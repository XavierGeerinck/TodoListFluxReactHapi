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
