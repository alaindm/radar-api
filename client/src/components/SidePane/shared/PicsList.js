import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment";
import {
  Card,
  CardActions,
  CardMedia,
  CardTitle,
  CardText
} from "material-ui/Card";
import FlatButton from "material-ui/FlatButton";
import PlaceIcon from "material-ui/svg-icons/maps/place";
import * as actions from "../../../actions";
import TextWithLinks from "./TextWithLinks";
import "./PicsList.css";

class PicsList extends Component {
  constructor(props) {
    super(props);
    this.state = { imagesLoading: true };
  }

  loadedImages = 0;

  imagesLoaded = () => {
    let totalImages = this.props.pics.length;
    this.loadedImages++;
    if (this.loadedImages === totalImages) {
      this.setState({
        imagesLoading: false
      });
    }
  };

  // componentWillReceiveProps(nextProps) {
  //   console.log(nextProps.pics.length);
  //   if (nextProps.pics.length === 0) {
  //     console.log("here");
  //     this.setState({
  //       imagesLoading: false
  //     });
  //   }
  // }

  renderSpinner() {
    if (!this.state.imagesLoading) {
      return null;
    } else {
      return <div className="spinner">Rendering all the images ...</div>;
    }
  }

  renderPicCard = item => {
    return (
      <div>
        <div>
          <Card className="card" key={item.id}>
            {item.location &&
              <div
                onClick={() =>
                  this.props.history.push(`/location/${item.location.id}`)}
                style={{ cursor: "pointer" }}
              >
                <PlaceIcon />
                <span>
                  {item.location.name}
                </span>
              </div>}
            <CardMedia
              overlay={
                <CardTitle
                  title={moment(item.date * 1000).fromNow()}
                  subtitle={`${item.likes.count} likes`}
                />
              }
            >
              <img
                src={item.thumbnail_src}
                onLoad={() => this.imagesLoaded()}
                onError={() => this.imagesLoaded()}
                alt="from post"
              />
            </CardMedia>
            <CardTitle subtitle={`${item.comments.count} comments`} />
            <CardText>
              <TextWithLinks text={item.caption} />
            </CardText>
            <CardActions>
              <FlatButton
                label="See Full Post"
                onClick={() => this.props.history.push(`/post/${item.code}`)}
              />
            </CardActions>
          </Card>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div>
        <div>
          {this.props.pics.length > 0
            ? this.renderSpinner()
            : <div>No recent photos here</div>}
        </div>
        <div className={this.state.imagesLoading ? "hidden" : ""}>
          {this.props.pics.length > 0 &&
            this.props.pics.map(this.renderPicCard)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    pics: state.insta.pics
  };
};

export default withRouter(connect(mapStateToProps, actions)(PicsList));
