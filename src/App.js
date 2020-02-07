import React from 'react';
import CountDown from './CountDown';
import Dropping2d from './Dropping2d';
import Dropping3d from './Dropping3d';
import Particles from './Particles';
import Summary from './Summary';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import './index.css';


function App(props) {
  return (
    <Router>
      <Switch>
        <Route exact path="/countdown" component={CountDown} />
        <Route exact path="/dropping2d" component={Dropping2d} />
        <Route path="/dropping3d" component={Dropping3d} />
        <Route path="/summary" component={Summary} />
        <Route path="/particles" component={Particles} />
        <Redirect to="/dropping2d" />
      </Switch>
    </Router>
  )
}

export default App;
