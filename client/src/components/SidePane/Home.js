import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { List, ListItem } from "material-ui/List";
import { Card, CardTitle } from "material-ui/Card";
import Avatar from "material-ui/Avatar";
import * as actions from "../../actions";

class Home extends Component {
  render() {
    return (
      <div>
        Home Page
        <Card>
          <CardTitle
            title="Suggested Centers"
            subtitle="Select region to see the latest photos around there!"
          />
          <List>
            <ListItem
              primaryText="Sydney Opera House"
              leftAvatar={<Avatar src="images/opera-house.jpg" />}
              onTouchTap={() => {
                this.props.goToRegion(
                  this.props.history,
                  -33.857684,
                  151.214825,
                  17
                );
              }}
            />
            <ListItem
              primaryText="Grand Canyon"
              leftAvatar={<Avatar src="images/grand-canyon.jpeg" />}
              onTouchTap={() => {
                this.props.goToRegion(
                  this.props.history,
                  36.062934,
                  -112.122818,
                  14
                );
              }}
            />
            <ListItem
              primaryText="Wembley Stadium"
              leftAvatar={<Avatar src="images/wembley.jpg" />}
              onTouchTap={() => {
                this.props.goToRegion(
                  this.props.history,
                  51.555854,
                  -0.279519,
                  16
                );
              }}
            />
          </List>
        </Card>
      </div>
    );
  }
}

export default withRouter(connect(null, actions)(Home));
