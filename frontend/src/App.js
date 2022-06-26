//import logo from './logo.svg';
import logo from './WPP.png';
import './App.css';
import React, { useState, useEffect, useMemo,  Component } from "react";
import { useMoralis } from "react-moralis";
import { Moralis } from 'moralis';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";

import Home from "./Home";
import CreatePromotion from "./CreatePromotion";
import Takequiz from "./TakeQuiz";
//import Claim from "./Claim";


/* Moralis init code */
const appId = process.env.REACT_APP_MORALIS_APP_ID;
const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL;
Moralis.start({ serverUrl, appId });


function App() { 
  const {
    Moralis,
    user,
    logout,
    authenticate,
    enableWeb3,
    isInitialized,
    isAuthenticated,
    isWeb3Enabled,
  } = useMoralis();
  const web3Account = useMemo(
    () => isAuthenticated && user.get("accounts")[0],
    [user, isAuthenticated],
  );
  if (!isAuthenticated) {
    return (
      <div>
        <button onClick={() => authenticate({ signingMessage: "World Promotional Platform!" })}>Authenticate</button>
      </div>
    );
  }
  return (    
    <Router>
        <div>  
        <button style={{float: 'right'}} onClick={() => logout()}>Logout</button>
        <div style={{float: 'right'}}>{web3Account}</div>           
          <img src={logo} alt="Logo" width="125" height="130" />
          <h1>World Promotional Platform</h1>
          <ul className="header">
          <li><NavLink exact to="/">Home</NavLink></li>
          <li><NavLink to="/createPromotion">Create Promotion</NavLink></li>
          <li><NavLink to="/takeQuiz">Available Promotions</NavLink></li> 
                   
          </ul>  
          <div className="content">
          <Routes>
          <Route exact path="/" element={<Home />}/>  
          <Route path="/CreatePromotion" element={<CreatePromotion/>}/> 
          <Route path="/Takequiz" element={<Takequiz/>}/>  
          </Routes>
          </div>          
        </div>
        </Router>   
  );
}

export default App;
