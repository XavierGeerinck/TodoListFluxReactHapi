import React, { PropTypes } from 'react';

class TodoListAdd extends React.Component {
	constructor(props) {
		super(props);
	}

	_handleOnSubmit() {
		var input = this.refs.input_todo.getDOMNode().value;
		this.props.handleOnSubmit(input);
	}

	render() {
		return (
			<div className="TodoListAdd">
				<form onSubmit={this._handleOnSubmit.bind(this)}>
					<input type="text" ref="input_todo" />
					<input type="submit" className="fa fa-plus" value="&#xf067;" />
				</form>
			</div>
		);
	}
}

TodoListAdd.propTypes = {
	handleOnSubmit: PropTypes.function
}

TodoListAdd.defaultProps = {
	handleOnSubmit: function () {}
}

export default TodoListAdd;
