/*global FB*/
import React, { Component } from "react";
import { connect } from "react-redux";
import { Card, CardTitle } from "material-ui/Card";
import TabsWithContent from "./shared/TabsWithContent";
import * as actions from "../../actions";

class Region extends Component {
  constructor(props) {
    super(props);
    this.timer = 150;
    this.counter = 1;
    this.FBcheckBeforeGetPics = () => {
      const FB = window.FB;
      const that = this;
      if (FB) {
        this.props.getMultiLocationPics();
      } else {
        setTimeout(function() {
          this.counter++;
          this.timer = this.timer + this.counter * 100;
          that.FBcheckBeforeGetPics();
        }, this.timer);
      }
      if (this.counter > 10) return;
    };
  }

  componentDidMount() {
    if (!this.props.PostId && this.props.mapState.bounds) {
      this.FBcheckBeforeGetPics();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.mapState.bounds !== nextProps.mapState.bounds) {
      this.FBcheckBeforeGetPics();
    }
  }

  render() {
    const regionHeader = () => {
      return (
        <Card>
          <CardTitle title="Latest photos in the selected map region" />
        </Card>
      );
    };
    return <TabsWithContent header={regionHeader} />;
  }
}

function mapStateToProps(state) {
  return {
    mapState: state.insta.mapState,
    pics: state.insta.pics,
    postId: state.insta.postData.id
  };
}

export default connect(mapStateToProps, actions)(Region);
