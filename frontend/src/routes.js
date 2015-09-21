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
