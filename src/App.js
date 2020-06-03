import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import {createBrowserHistory} from 'history/';

import './index.css';
import Introarea from './Introarea';
import CountDown from './CountDown';
import Centrepiece from './Centrepiece';
// import Dropping3d from './Dropping3d';
import Particles from './Particles';
// import Summary from './Summary';


function App(props) {
  const history = createBrowserHistory({ basename: '/popsquare/' });

  return (
    <Router history={history} basename="/popsquare/">
      <Switch>
        <Route exact path="/countdown" component={CountDown} />
        <Route exact path="/" component={Centrepiece} />
        <Route path="/particles" component={Particles} />
        {/* <Route path="/summary" component={Summary} /> */}
        <Route path="/intro" render={()=><Introarea mutedgame={true}/>} />
        {/* <Redirect to="/dropping2d" /> */}
      </Switch>
    </Router>
  )
}

export default App;