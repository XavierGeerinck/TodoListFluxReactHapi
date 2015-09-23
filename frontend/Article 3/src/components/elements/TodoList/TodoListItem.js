import React, { PropTypes } from 'react';

class TodoListItem extends React.Component {
	constructor(props) {
		super(props);
	}

	_handleCheckItem(e) {
		e.preventDefault();

		this.props.onCheckItem(this.props.item);
	}

	_handleRemoveItem(e) {
		e.preventDefault();

		this.props.onRemoveItem(this.props.item);
	}

	render() {
		const { item } = this.props;


		return (
			<div className="TodoListItem">
				<div className="TodoListItem-Check">
					<input type="checkbox" ref="is_checked" checked={item.isChecked} onChange={this._handleCheckItem.bind(this)}/>
				</div>

				<span>{item.value}</span>
				<button onClick={this._handleRemoveItem.bind(this)}><i className="fa fa-remove"></i></button>

				<div className="clear"></div>
			</div>
		);
	}
}

TodoListItem.propTypes = {
	item: PropTypes.string,
	onRemoveItem: PropTypes.function,
	onCheckItem: PropTypes.function
}

TodoListItem.defaultProps = {
	item: "",
	onRemoveItem: function () {},
	onCheckItem: function () {}
}

export default TodoListItem;
