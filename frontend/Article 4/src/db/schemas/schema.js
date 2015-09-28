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
