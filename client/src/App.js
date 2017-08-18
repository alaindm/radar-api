/*global FB*/
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import RaisedButton from "material-ui/RaisedButton";
import NavBar from "./components/Navbar/Navbar";
import Region from "./components/SidePane/Region";
import Location from "./components/SidePane/Location";
import User from "./components/SidePane/User";
import Post from "./components/SidePane/Post";
import Tag from "./components/SidePane/Tag";
import About from "./components/SidePane/About";
import Feature from "./components/SidePane/Feature";
import Pp from "./components/SidePane/Pp";
import Tos from "./components/SidePane/Tos";
import Removal from "./components/SidePane/Removal";
import Error from "./components/SidePane/Error";
import Home from "./components/SidePane/Home";
import Map from "./components/Map/googlemap.jsx";
// import * as actions from './actions';
import "./App.css";

class App extends Component {
  componentDidMount() {
    window.fbAsyncInit = function() {
      FB.init({
        appId: process.env.REACT_APP_FB_APP_ID,
        autoLogAppEvents: true,
        xfbml: true,
        version: "v2.9"
      });
      FB.AppEvents.logPageView();
    };

    (function(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");

    const ele = document.getElementById("ipl-progress-indicator");
    if (ele) {
      setTimeout(() => {
        ele.classList.add("available");
        setTimeout(() => {
          ele.outerHTML = "";
        }, 300);
      }, 700);
    }
  }

  render() {
    return (
      <Router>
        <MuiThemeProvider>
          <div className="app">
            <div id="fb-root" />
            <div className="navbar">
              <NavBar />
            </div>
            <div className="main">
              <div className="map">
                <Route
                  render={({ history }) =>
                    <RaisedButton
                      className="get-button"
                      label="Get Region's Latest Photos"
                      secondary={true}
                      onTouchTap={() => history.push("/region")}
                    />}
                />
                <Map />
              </div>
              <div className="sidepane">
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route path="/region" component={Region} />
                  <Route path="/location/:id" component={Location} />
                  <Route path="/about" component={About} />
                  <Route path="/user/:id" component={User} />
                  <Route path="/post/:id" component={Post} />
                  <Route path="/tag/:id" component={Tag} />
                  <Route path="/about" component={About} />
                  <Route path="/feature" component={Feature} />
                  <Route path="/pp" component={Pp} />
                  <Route path="/tos" component={Tos} />
                  <Route path="/removal" component={Removal} />
                  <Route path="/error" component={Error} />
                </Switch>
              </div>
            </div>
          </div>
        </MuiThemeProvider>
      </Router>
    );
  }
}

export default App;
