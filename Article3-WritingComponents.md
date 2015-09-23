# Creating a TODO Application from scratch in React.JS / Flux / Hapi (part 2)
# Writing the TODOList components
## 1. Introduction
So in part 1 we learned how the components work and how we can port our design over to this component based design. In part 2 we then went ahead and created our initial bootstrap for our application so that we are able to start working. Part 3 will be about creating our TODOList app as it is shown in the design. We will completely convert the design to the components and will be able to perform the actions such as checking items.

Please note that all the actions will be statically in this part and we will not be able to save it to a database yet. This part will be handled in part 4 (creating the API) and 5 (Creating the React.JS actions).

## 2. The components
As explained before we have the following components that we will have to create:

* **TodoList Page:** This is our page where we will put in the todolist component.
* **TodoList Component:** This is the component that we will be able to integrate into our page.
* **TodoListAdd:** The input box to add new todo items
* **TodoList:** The list of items
* **TodoListItem:** An item itself

We have already wrote the initial files for the TodoListPage component, which is why we will continue with the others before completing this one. This is because this component relies on the other components to be completed.

## 3. TodoList Component
Let's now start on the TodoList Component, for this create a folder in the `src/components/elements` folder called **TodoList**. This folder will then have the same bootstrap files as the TodoListPage folder: `TodoList.js`, `TodoList.css`, `package.json`. But we will also create extra files to accommodate the other features. Now also add `TodoListAdd.js`, `TodoListItems.js` and `TodoListItem.js`.

The TodoList folder will now look like this:

```
- src/components/elements/TodoList/
    - TodoList.css
    - TodoList.js
	- TodoListAdd.js
	- TodoListItems.js
	- TodoListItem.js
    - package.json
```

### 3.1. Writing the TodoList.js part
We are finally at the part of writing a component, it has been a long way but now the real work starts. Writing the component. Let us first start by defining the structure of the TodoList.js part. It will exist out of the Add box and the Overview box. So, add 2 elements `<TodoListAdd />`` and `<TodoListItems />` which will show our items. Your class will look like this then:

```js
import React, { PropTypes } from 'react';
import TodoListAdd from './TodoListAdd';
import TodoListItems from './TodoListItems';

class TodoList extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="TodoList">
				<TodoListAdd />
				<TodoListItems />
			</div>
		);
	}
}

export default TodoList;
```

### 3.2. Back to our TodoListPage
Now create the bootstrap files for the `TodoListAdd.js` and the `TodoListItems.js` files. This will allow us to add the TodoList component to our TodoListPage file. When you did this, add the TodoList Component to your Page by adding <TodoList /> in it's render function. (Do not forget to include it.)

If you did everything right, when you reload the page it will show a blank page and no errors have happened in the console. If you encounter an error here, go back and see if you did not forget anything. Else check the repository.

## 3.3. Finishing the TodoListAdd part
The add function will allow us to insert a TodoItem by entering it's info into a textbox and clicking on the add button. We will also do this, so add a `<input type="text" ref="input_todo" />` and a `<input type="submit" />` element in the render function of the TodoListAdd part.

You will get this:
```js
<div className="TodoListAdd">
	<form onSubmit={this._handleOnSubmit.bind(this)}>
		<input type="text" ref="input_todo" />
		<input type="submit" />
	</form>
</div>
```

Note that I have already went ahead and created the event handler, it will call a local function `_handleOnSubmit` when a user submits the form. This function is here:
```js
_handleOnSubmit() {
	var input = this.refs.input_todo.getDOMNode().value;
	console.log(input);
}
```

for now it will just output our value that we have entered in the console.

> We are able to get the value of the textbox by placing a **ref** attribute on the HTML input element. Because of this we can now check `this.refs.input_todo` which contains this element. By calling `getDOMNode()` we can then ask react to get the raw HTML element and then get the value of it.

We are still not finished, the last part that we have to do is to give back this value to the parent component, this is needed since we do not allow TodoListAdd to have a state. The state of this TodoListComponent is managed through the root component, which is TodoList.

Therefor we will pass a function which will act as a sort of callback function to the root component. Adding this is really easy, we can add a property (which we will call handleOnSubmit) and call `this.props.handleOnSubmit` instead of the console.log.

To make sure that we allow this, we can add a <MODULE>.propTypes = { } and define our just explained function.

The resulting class looks like this:

```js
import React, { PropTypes } from 'react';

class TodoListAdd extends React.Component {
	constructor(props) {
		super(props);
	}

	_handleOnSubmit() {
		var input = this.refs.input_todo.getDOMNode().value;

		console.log(this.props);
		this.props.handleOnSubmit(input);
	}

	render() {
		return (
			<div className="TodoListAdd">
				<form onSubmit={this._handleOnSubmit.bind(this)}>
					<input type="text" ref="input_todo" />
					<input type="submit" />
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
```

The code for adding the item is done, we will now go on to displaying the items. Do not worry about the items being inserted into our TodoList component state yet, this will happen on the end.

### 3.4. Finishing the TodoListItems part
Showing the TodoListItems is easy, we just check the items that were passed through an attribute and render those. The rendered items are then in turn TodoListItem components which will call the render function in the TodoListItem.js file.

**TodoListItems.js**
```js
import React, { PropTypes } from 'react';
import TodoListItem from './TodoListItem';

class TodoListItems extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { items } = this.props;

		return (
			<div className="TodoListItems">
				{
					items.map(i => {
						return <TodoListItem item={i} />
					})
				}
			</div>
		);
	}
}

TodoListItems.propTypes = {
	items: PropTypes.array
}

TodoListItems.defaultProps = {
	items: []
}

export default TodoListItems;
```

**TodoListItem.js**
```js
import React, { PropTypes } from 'react';

class TodoListItem extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { item } = this.props;

		return (
			<div className="TodoListItem">
				{item}
			</div>
		);
	}
}

TodoListItem.propTypes = {
	item: PropTypes.string
}

TodoListItem.defaultProps = {
	item: ""
}

export default TodoListItem;
```

### 3.5. Quickly testing what we have
For a quick test of what we have now works, just change the content of your `TodoList.js` file to this:

```js
import React, { PropTypes } from 'react';
import TodoListAdd from './TodoListAdd';
import TodoListItems from './TodoListItems';

class TodoList extends React.Component {
	constructor(props) {
		super(props);
	}

	_handleAddSubmit(value) {
		console.log('Received item: ' + value);
	}

	render() {
		const items = [ "test1", "test2", "test3", "test4" ];
		return (
			<div className="TodoList">
				<TodoListAdd handleOnSubmit={this._handleAddSubmit.bind(this)}/>
				<TodoListItems items={items} />
			</div>
		);
	}
}

export default TodoList;
```

When we load the page now, we will see our items being added and when we add an item there will happen a console.log showing the added item it's value.

Of course this is not yet how we want it! We still need to define a state which will hold our items so we can perform actions on it such as adding and removing items for this component.

### 3.6. Finishing the TodoList Component
Let us finish this adding now. For that to happen, we will first have to convert our TodoList to work with states. So replace the content with this:

```js
import React, { PropTypes } from 'react';
import update from 'react/lib/update';
import TodoListAdd from './TodoListAdd';
import TodoListItems from './TodoListItems';

class TodoList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			items: [ ]
		}
	}

	_handleAddSubmit(value) {
		var self = this;

		self.setState({
			items: update(self.state.items, {
				$push: [ value ]
			})
		});
	}

	render() {
		const { items } = this.state;

		return (
			<div className="TodoList">
				<TodoListAdd handleOnSubmit={this._handleAddSubmit.bind(this)}/>
				<TodoListItems items={items} />
			</div>
		);
	}
}

export default TodoList;
```

As you can see we changed the constructor. This one now has a state and will be able to hold our items. We also changed our render method to use the state variable and render the items from it. The last thing that we changed is the handler for the item submission, here we will set the state but we will use the update library of react to be able to use $push, which allows us to add items to an existing array.

Let's now change the rendering of the TodoItem part so that we are able to remove them and set them marked one by one.

### 3.7. Finishing the TodoItem
What we will do for the TodoItem, is add a checkbox and a removal button and bind 2 handlers. These handlers will then be pushed towards the parent component (TodoItems) which in it's turn will push a change event towards it's parent (the TodoList). We will also change the way items work by creating objects with { isChecked, value } as the keys. This way we can check the items that have been checked.

Now our **TodoItem.js** files becomes this:

```js
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
	item: ""
}

export default TodoListItem;
```

**TodoListItems.js**
```js
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
	items: []
}

export default TodoListItems;
```

and **TodoList.js**
```js
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
```

> Note the key property? This is really important in react, react will update the components based on if the key has been changed or not. So to trigger an update to this key object we have to provide a different key. The key is created based on the id of the item and the checkstate here.

## 4. Adding some CSS
So we are completely finished with the interaction part, now all that is left to do is to add some css code to make it better on the eye

```css
.TODOList {
	width: 400px;
	margin: 0 auto;
}

.TODOList h1 {
	font-size: 16px;
}

.TodoListAdd {
	border: 1px solid #d9d9d9;
}

.TodoListAdd input {
	background-color: #f5f5f5;
	border: none;
	width: calc(100% - 40px);
    box-sizing: border-box;
	height: 30px;
}

.TodoListAdd input[type='submit'] {
	width: 40px;
	border-left: 1px solid #d9d9d9;
}

.TodoListAdd input[type='text'] {
	padding: 7px 10px;
}

.TodoListItems {
	margin-top: 20px;
}

.TodoListItem {
	box-sizing: border-box;
	background-color: #f5f5f5;
	border: 1px solid #d9d9d9;
	border-bottom: none;
	height: 30px;
}

.TodoListItem:last-child {
	border-bottom: 1px solid #d9d9d9;
}

.TodoListItem button {
	height: 100%;
	float: right;
	border: none;
	padding: 0;
	margin: 0;
	width: 40px;
	border-left: 1px solid #d9d9d9;
	background-color: transparent;
}

.TodoListItem span {
	height: 100%;
	float: left;
	line-height: 30px;
	font-size: 12px;
	padding-left: 6px;
}

.TodoListItem .TodoListItem-Check {
	height: 100%;
	border-right: 1px solid #d9d9d9;
	margin-left: 5px;
	margin-right: 5px;
	width: 20px;
	float: left;
	line-height: 30px;
}

.clear {
	clear: both;
}
```

# 5. Finalize
The application is now complete and we are able to use the module, however in a real world application we need to save the state to a database when we perform an action. This will be covered in parts 4 and 5 where we will write the backend and add interaction with the backend to the react.js application.
