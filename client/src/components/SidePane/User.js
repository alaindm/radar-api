import React, { Component } from "react";
import { connect } from "react-redux";
import { Card, CardHeader, CardText } from "material-ui/Card";
import TabsWithContent from "./shared/TabsWithContent";
import * as actions from "../../actions";

class User extends Component {
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getUserInfo(id);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params !== nextProps.match.params) {
      const { id } = nextProps.match.params;
      this.props.getUserInfo(id);
    }
  }

  render() {
    let user = this.props.userData;
    const renderPrivateUserInfo = () => {
      return (
        <div>
          <CardText>
            <div>This is a private user</div>
            <div>No public content available</div>
          </CardText>
        </div>
      );
    };
    const userHeader = () => {
      if (user) {
        return (
          <Card className="card">
            <CardHeader
              title={
                <div>
                  {user.full_name}
                </div>
              }
              subtitle={
                <div>
                  {`${user.media.count} posts | ${user.followed_by
                    .count} followers | ${user.follows.count} following`}
                </div>
              }
              avatar={user.profile_pic_url}
            />
            <CardText>
              {user.biography}
            </CardText>
            {user.is_private && renderPrivateUserInfo()}
          </Card>
        );
      } else {
        return <div />;
      }
    };
    return <TabsWithContent header={userHeader} />;
  }
}

const mapStateToProps = state => {
  return {
    userData: state.insta.userData
  };
};

export default connect(mapStateToProps, actions)(User);
