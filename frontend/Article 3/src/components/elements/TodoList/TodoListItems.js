import React, { PropTypes } from 'react';
import TodoListItem from './TodoListItem';

class TodoListItems extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { items, onRemoveItem, onCheckItem } = this.props;
		var self = this;

		return (
			<div className="TodoListItems">
				{
					items.map(i => {
						return <TodoListItem item={i} key={i.key} onRemoveItem={onRemoveItem} onCheckItem={onCheckItem} />
					})
				}
			</div>
		);
	}
}

TodoListItems.propTypes = {
	items: PropTypes.array,
	onRemoveItem: PropTypes.function,
	onCheckItem: PropTypes.function
}

TodoListItems.defaultProps = {
	items: [],
	onRemoveItem: function () {},
	onCheckItem: function () {}
}

export default TodoListItems;
