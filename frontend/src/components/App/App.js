import React, { PropTypes } from 'react';
import './App.css';

class App extends React.Component {
	constructor(props) {
		super(props);
	}

    render() {
        return (
            <div id="app" className="App-Container">
                {this.props.children}
            </div>
        );
    }
}

export default App;
