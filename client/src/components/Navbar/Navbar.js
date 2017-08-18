// /*global google*/
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import TextField from "material-ui/TextField";
import IconMenu from "material-ui/IconMenu";
import IconButton from "material-ui/IconButton";
import FontIcon from "material-ui/FontIcon";
import NavigationExpandMoreIcon from "material-ui/svg-icons/navigation/expand-more";
import MenuItem from "material-ui/MenuItem";
// import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import { Toolbar, ToolbarGroup, ToolbarSeparator } from "material-ui/Toolbar";
import SearchIcon from "material-ui/svg-icons/action/search";
import { connect } from "react-redux";

import * as actions from "../../actions";
import logo from "./logo.svg";
// import './Navbar.css';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: ""
    };
  }

  // componentDidMount() {
  //   this.searchBox = new google.maps.places.SearchBox(this.textInput);
  //   this.searchBox.addListener('places_changed', this.onPlacesChanged);
  // }

  // onPlacesChanged = () => {
  //   if (this.props.onPlacesChanged) {
  //       this.props.onPlacesChanged(this.searchBox.getPlaces());
  //   }
  // }
  // ref={input => this.textInput = input}

  handleSubmit = event => {
    event.preventDefault();
    // this.props.history.push("/region");
    this.props.zoomToArea(this.state.searchText);
    this.setState({
      searchText: ""
    });
  };
  // <div className="fb-login-button" data-max-rows="1" data-size="large" data-button-type="login_with" data-show-faces="false" data-auto-logout-link="true"
  // data-use-continue-as="true">

  render() {
    return (
      <div className="">
        <Toolbar>
          <ToolbarGroup firstChild={true}>
            <img src={logo} alt="App logo" />
            <form onSubmit={this.handleSubmit}>
              <TextField
                onChange={event => {
                  this.setState({
                    searchText: event.target.value
                  });
                }}
                value={this.state.searchText}
                hintText="Find a location..."
              />
            </form>
            <FlatButton
              icon={<SearchIcon />}
              style={{ margin: 2 }}
              onTouchTap={() => this.props.zoomToArea(this.state.searchText)}
            />
          </ToolbarGroup>
          <ToolbarGroup>
            <FontIcon className="muidocs-icon-custom-sort" />
            <ToolbarSeparator />
            <RaisedButton
              label="Share this App"
              primary={true}
              onTouchTap={() => this.props.logFBplaces()}
            />
            <IconMenu
              iconButtonElement={
                <IconButton touch={true}>
                  <NavigationExpandMoreIcon />
                </IconButton>
              }
              anchorOrigin={{ horizontal: "right", vertical: "top" }}
              targetOrigin={{ horizontal: "right", vertical: "top" }}
            >
              <MenuItem
                primaryText="About"
                onTouchTap={() => this.props.history.push("/about")}
              />
              <MenuItem
                primaryText="Terms of Service"
                onTouchTap={() => this.props.history.push("/tos")}
              />
              <MenuItem
                primaryText="Private Policy"
                onTouchTap={() => this.props.history.push("/pp")}
              />
              <MenuItem
                primaryText="Request a feature"
                onTouchTap={() => this.props.history.push("/feature")}
              />
              <MenuItem
                primaryText="Content Removal"
                onTouchTap={() => this.props.history.push("/removal")}
              />
            </IconMenu>
          </ToolbarGroup>
        </Toolbar>
      </div>
    );
  }
}

export default withRouter(connect(null, actions)(Navbar));
