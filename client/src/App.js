
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css';
import Login from './page/login';
import Registre from './page/registre';
import Home from './page/home';
import { useJwt } from 'react-jwt';


function App() {
  
  return (
    <Router>
    <div className="App">
    <Switch>
          <Route exact path="/" ><Home/></Route>
          <Route path="/login" ><Login/></Route>
          <Route path="/registre" ><Registre/></Route>         
          <Route path="/home" ><Home/></Route>
          
        </Switch>
    </div>
    </Router>
  );
}

export default App;
