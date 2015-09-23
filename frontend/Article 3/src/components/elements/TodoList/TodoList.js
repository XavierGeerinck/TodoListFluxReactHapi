import React, { PropTypes } from 'react';
import update from 'react/lib/update';
import TodoListAdd from './TodoListAdd';
import TodoListItems from './TodoListItems';
import './TodoList.css';

class TodoList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			items: [],
			id_counter: 0
		}
	}

	_handleAddSubmit(value) {
		var self = this;

		self.setState({
			items: update(self.state.items, {
				$push: [{
					id: self.state.id_counter,
					isChecked: false,
					value: value,

					// Set initial key based on the id and the check state
					key: "key_" + self.state.id_counter + "_" + false
				}]
			}),
			id_counter: self.state.id_counter + 1
		});
	}

	_onRemoveItem(item) {
		var self = this;

		self.setState({
			items: self.state.items.filter(i => {
				return i.id !== item.id
			})
		});
	}

	_onCheckItem(item) {
		var self = this;
		self.setState({
			items: self.state.items.map(i => {
				if (item.id === i.id) {
					i.isChecked = !item.isChecked;

					// Change key since it has been checked!
					i.key = "key_" + i.id + "_" + i.isChecked;
				}

				return i;
			})
		});
	}

	render() {
		const { items } = this.state;

		return (
			<div className="TodoList">
				<TodoListAdd handleOnSubmit={this._handleAddSubmit.bind(this)}/>
				<TodoListItems items={items} onRemoveItem={this._onRemoveItem.bind(this)} onCheckItem={this._onCheckItem.bind(this)}/>
			</div>
		);
	}
}

export default TodoList;
