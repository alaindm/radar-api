import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import shouldPureComponentUpdate from "react-pure-render/function";
import PlaceIcon from "material-ui/svg-icons/maps/place";

// import {locationMarkerStyle, locationMarkerStyleHover} from './LocationMarker_styles';

class LocationMarker extends Component {
  static propTypes = {
    $hover: PropTypes.bool,
    text: PropTypes.string
  };

  // constructor(props) {
  //   super(props);
  // }

  static defaultProps = {};

  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {
    const isViewingLocation =
      this.props.$dimensionKey === this.props.locationComponentId;
    const textStyle = {
      position: "absolute",
      transform: "translateY(-25%)",
      whiteSpace: "nowrap",
      fontColor: "grey",
      fontSize: 13
    };
    const textStyleHover = {
      ...textStyle,
      fontWeight: "bold",
      fontColor: "black",
      fontSize: 14
    };
    const renderText = text =>
      text.length > 20 ? `${text.slice(0, 18)}...` : text;
    // const style = this.props.$hover ? locationMarkerStyleHover : locationMarkerStyle
    const iconColor = this.props.$hover || isViewingLocation ? "black" : "grey";
    const titleStyle =
      this.props.$hover || isViewingLocation ? textStyleHover : textStyle;

    return (
      /*<div style={style}>
        {this.props.text}
      </div>*/
      <div>
        <PlaceIcon color={iconColor} />
        <span style={titleStyle}>
          {renderText(this.props.text)}
        </span>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    locationComponentId: state.insta.locationData.idOriginal
  };
}

export default connect(mapStateToProps)(LocationMarker);
