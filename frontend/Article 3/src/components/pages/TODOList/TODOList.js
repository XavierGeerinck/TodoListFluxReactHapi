import React, { PropTypes } from 'react';
import TodoList from '../../elements/TodoList';

class TODOList extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="TODOList">
				<h1>TodoList</h1>
				<TodoList />
			</div>
		)
	}
}

export default TODOList;
