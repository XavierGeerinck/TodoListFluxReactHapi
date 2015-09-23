# Creating a TODO Application from scratch in React.JS / Flux / Hapi (part 2)
# Creating the initial components to load a HELLO WORLD page
## 1. Introduction
So in part 1 we explained why you should use React.JS and how it works, in this part we will set up the development environment and start creating our TODOList components that we have split up in the previous article.

## 2. Development Environment - Webpack
An easy way to get started in a few minutes is by installing webpack. This is pretty straightforward once you have done the initial configuration.

Start by creating a file called `webpack.config.js` in your root folder and paste the following content into it:

```js
var path = require('path');
var webpack = require('webpack');
var node_modules_dir = path.resolve(__dirname, 'node_modules');

const AUTOPREFIXER_BROWSERS = [
	'Android 2.3',
	'Android >= 4',
	'Chrome >= 20',
	'Firefox >= 24',
	'Explorer >= 8',
	'iOS >= 6',
	'Opera >= 12',
	'Safari >= 6'
];

var config = {
	entry: {
		app: ['webpack/hot/dev-server', 'webpack-dev-server/client?http://localhost:8080', path.resolve('src/index.js')],
	},
	output: {
		path: process.env.NODE_ENV === 'production' ? path.resolve(__dirname, 'dist') : path.resolve(__dirname, 'build'),
		filename: 'bundle.js'
	},
	module: {
		noParse: [],
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: [node_modules_dir],
				loaders: ['react-hot', 'babel']
			},
			{
				test: /\.html$/,
				loader: 'file?name=[name].[ext]'
			},
			{
				test: /\.css$/,
				exclude: [node_modules_dir],
				loader: 'style-loader!css-loader!cssnext-loader'
			},
			{
				test: /\.txt/,
				loader: 'file-loader?name=[path][name].[ext]'
			},
			{
				test: /\.gif/,
				loader: 'url-loader?limit=10000&mimetype=image/gif'
			},
			{
				test: /\.jpg/,
				loader: 'url-loader?limit=10000&mimetype=image/jpg'
			},
			{
				test: /\.png/,
				loader: 'url-loader?limit=10000&mimetype=image/png'
			},
			{
				test: /\.svg/,
				loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
			},
			{
				test: /\.eot/,
				loader: 'url-loader?limit=100000&mimetype=application/vnd.ms-fontobject'
			},
			{
				test: /\.woff2/,
				loader: 'url-loader?limit=100000&mimetype=application/font-woff2'
			},
			{
				test: /\.woff/,
				loader: 'url-loader?limit=100000&mimetype=application/font-woff'
			},
			{
				test: /\.ttf/,
				loader: 'url-loader?limit=100000&mimetype=application/font-ttf'
			}
		]
	},
	resolve: {
		extensions: ['', '.js', '.jsx'],
		alias: {}
	},
	cssnext: {},
	postcss: [
		require('postcss-nested')(),
		require('cssnext')(),
		require('autoprefixer-core')(AUTOPREFIXER_BROWSERS)
	],
	plugins: [
		new webpack.DefinePlugin({"global.GENTLY": false})
	],
	node: {
		__dirname: true
	}
};

module.exports = config;
```

If we analyze this file then we can see that we will transform our Javascript with babel and the react hot loader (which allows hot reloading), and transform our css using cssnext so that we will be able to use next-gen css features such as var().

The last file we will need to define before we will be able to start our environment is the **package.json** file.

```json
{
  "name": "tutorial_react_flux_hapi",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.js",
  "devDependencies": {
    "autoprefixer-core": "^6.0.0",
    "babel-core": "^5.8.23",
    "babel-loader": "^5.3.2",
    "css-loader": "^0.17.0",
    "cssnext": "^1.8.4",
    "cssnext-loader": "^1.0.1",
    "file-loader": "^0.8.4",
    "font-awesome": "^4.4.0",
    "jsx-loader": "^0.13.2",
    "normalize.css": "^3.0.3",
    "postcss": "^5.0.4",
    "postcss-loader": "^0.6.0",
    "postcss-nested": "^1.0.0",
    "react-hot-loader": "^1.3.0",
    "style-loader": "^0.12.3",
    "url-loader": "^0.5.6",
    "webpack": "^1.12.1",
    "webpack-dev-server": "^1.10.1"
  },
  "scripts": {
    "dev": "",
    "start": "webpack-dev-server --devtool eval --progress --colors --content-base build --hot --inline",
    "deploy": "NODE_ENV=production webpack -p"
  },
  "dependencies": {
    "babel-eslint": "^4.0.5",
    "babel-runtime": "^5.8.20",
    "bootstrap": "^3.3.5",
    "eslint": "^1.1.0",
    "eslint-plugin-react": "^3.2.2",
    "flux": "^2.0.3",
    "history": "^1.9.1",
    "react": "^0.13.3",
    "react-bootstrap": "^0.24.5",
    "react-mixin": "^1.7.0",
    "react-router": "^1.0.0-rc1",
    "superagent": "^1.4.0"
  }
}
```

This file will install the dependencies and will also define our startup script for our environment.

Now let's start the environment, first run `npm install` to install the dependencies and then you start the environment itself by running `npm start`, which will call the webpack file with some startup parameters (see package.json for this definition).

You will now see that it starts the environment but with some error at the end stating that we are missing our *index.js* file. This is normal since we have not written any code yet so just ignore this for now. The environment itself is now available on `localhost:8080`.

## 3. Writing the initial React.js files
The development environment is working, so we can finally start coding! When working with react it is important to first fill in the content for the `src/index.js`, `src/index.html` and `src/routes.js` since these will be our main entry points.

* `index.js`: Will be the main entry point for the package.json, this starts react or in our case intialises the router.
* `index.html`: This file is our html file that will get loaded when we load `localhost:8080`, it will contain the hot reloader script and the javascript compiled bundle.
* `routes.js`: Here are our routes that will be used, only the / route will be used seeing that this is a 1 page app. I however included this so that your app is able to grow.

**index.js**
```js
import React from 'react';
import routes from './routes';

// Install the routes
React.render(routes, document.body);
```

**index.html**
```js
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <link rel="stylesheet" href="styles/main.css">
</head>

<body>
  <script src="http://localhost:8080/webpack-dev-server.js"></script>
  <script type="text/javascript" src="bundle.js"></script>
</body>

</html>
```

**routes.js**
```js
import React from 'react/addons';
import { Router, Route, IndexRoute  } from 'react-router';
import App from './components/App';
import TODOListPage from './components/pages/TODOList';

var routes = (
    <Router>
        <Route path="/" component={App}>
            <IndexRoute component={TODOListPage} />
        </Route>
    </Router>
);

export default routes;
```

## 4. Creating our Application component
The application is the mother of our components, it will load the page that we are trying to load and that was defined in the routes file. We can also use it to set the authentication state of a user if we got a login functionality.

To create this component, go to the App folder in src/components/App and create the 3 files that make a component (App.css, App.js, package.json).

Fill these in with the following content:

**package.json**
```json
{
	"name": "App",
	"private": true,
	"version": "0.0.0",
	"main": "./App.js"
}
```

**App.js**
```js
import React, { PropTypes } from 'react';
import Router from 'react-router';
import './App.css';
var RouteHandler = Router.RouteHandler;

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

App.defaultProps = {

};

App.propTypes = {

};

export default App;
```

**App.css (EMPTY)**

## 5. Testing the bootstrap
We start by creating our page, this way we are at least able to access our webpage. To do this, bootstrap a TODOList component in the `src/components/pages` folder. Now we will fill in the render function, here just return a new div element with as class the TODOListPage name.

For now we can put a HELLO WORLD string into the component so that we are able to test if it is all working nicely just as we want to. For that make your TODOListPage component look like this:

```js
import React, { PropTypes } from 'react';

class TODOList extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="TODOList">
			HELLO WORLD
			</div>
		)
	}
}

export default TODOList;
```

When we now run `npm start` and navigate to `http://localhost:8080`, we will be presented with a nice HELLO WORLD body. Congratulations, we now got the initial bootstrap ready and we are able to start writing our TODOList components.

The part of writing the other TODOList components will be tackled in part 3.
