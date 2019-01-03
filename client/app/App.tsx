import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ScooterMap from './components/Map';
import './App.less';

ReactDOM.render(
  <Router>
    <div className="app">
      <Switch>
        <Route exact path="/" component={ScooterMap} />
        <Route path="/map" component={ScooterMap} />
      </Switch>
    </div>
  </Router>,
  document.getElementById('app')
);
