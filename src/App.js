import React from 'react';
import Scene from './Scene';
import Summary from './Summary';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './index.css';


function App() {
  return (
    <Router>
      <Route exact path="/" component={Scene} />
      <Route path="/summary" component={Summary} />
    </Router>
  )
}

export default App;
