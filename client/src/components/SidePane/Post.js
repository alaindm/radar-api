import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment";
import Loading from "./shared/Loading";
import Error from "./Error";
import Comments from "./shared/Comments";
import BackButton from "./shared/BackButton";
import PlaceIcon from "material-ui/svg-icons/maps/place";
import {
  Card,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText
} from "material-ui/Card";
import * as actions from "../../actions";

class Post extends Component {
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getPostInfo(id);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params !== nextProps.match.params) {
      const { id } = nextProps.match.params;
      this.props.getPostInfo(id);
    }
  }

  componentWillUnmount() {
    this.props.cleanPostData();
  }

  render() {
    const post = this.props.postData;
    const conditionalPostLocationHeader = () => {
      if (post.location) {
        return (
          <div
            onClick={() =>
              this.props.history.push(`/location/${post.location.id}`)}
            style={{
              cursor: "pointer",
              position: "relative"
            }}
          >
            <PlaceIcon color="grey" hoverColor="black" />
            <span
              style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                whiteSpace: "nowrap"
              }}
            >
              {post.location.name}
            </span>
          </div>
        );
      }
    };

    if (this.props.loading) {
      return <Loading />;
    }

    if (this.props.error) {
      return <Error />;
    }

    if (post !== undefined && post.owner) {
      return (
        <div className="scroll">
          <BackButton />
          <Card className="card">
            <CardHeader
              title={
                <div
                  onClick={() =>
                    this.props.history.push(`/user/${post.owner.username}`)}
                  style={{ cursor: "pointer" }}
                >
                  {post.owner.full_name}
                </div>
              }
              subtitle={conditionalPostLocationHeader()}
              avatar={post.owner.profile_pic_url}
            />
            <CardMedia
              overlay={
                <CardTitle
                  title={moment(post.taken_at_timestamp * 1000).fromNow()}
                  subtitle={`${post.edge_media_preview_like.count} likes`}
                />
              }
            >
              <img src={post.display_url} alt="from post" />
            </CardMedia>
            <CardTitle
              subtitle={post.edge_media_to_caption.edges.map(x => {
                return (
                  <div key={x.node.text}>
                    {x.node.text}
                  </div>
                );
              })}
            />
            <CardText>
              <Comments comments={post.edge_media_to_comment} />
            </CardText>
          </Card>
        </div>
      );
    } else {
      return <Loading />;
    }
  }
}

function mapStateToProps(state) {
  return {
    postData: state.insta.postData
  };
}

export default withRouter(connect(mapStateToProps, actions)(Post));
