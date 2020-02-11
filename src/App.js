import React from 'react';
import CountDown from './CountDown';
import Dropping2d from './Dropping2d';
import Dropping3d from './Dropping3d';
import Particles from './Particles';
import Summary from './Summary';
import { Router, Route, Switch } from 'react-router-dom';
import {createBrowserHistory} from 'history/';

import './index.css';


function App(props) {
  const history = createBrowserHistory({ basename: '/popsquare/' });

  return (
    <Router history={history} basename="/popsquare/">
      <Switch>
        <Route exact path="/countdown" component={CountDown} />
        <Route exact path="/" component={Dropping2d} />
        <Route path="/dropping3d" component={Dropping3d} />
        <Route path="/summary" component={Summary} />
        <Route path="/particles" component={Particles} />
        {/* <Redirect to="/dropping2d" /> */}
      </Switch>
    </Router>
  )
}

export default App;
