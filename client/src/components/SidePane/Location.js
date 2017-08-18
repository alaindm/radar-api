import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Card, CardTitle } from "material-ui/Card";
import RaisedButton from "material-ui/RaisedButton";
import MapIcon from "material-ui/svg-icons/maps/map";
import TabsWithContent from "./shared/TabsWithContent";
import PlaceIcon from "material-ui/svg-icons/maps/place";
import { getSingleLocationPics, setCenter } from "../../actions";

const styles = {
  button: {
    margin: 12
  },
  exampleImageInput: {
    cursor: "pointer",
    position: "relative",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: "100%",
    opacity: 0
  }
};

class Location extends Component {
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.locationData.idOriginal !== id &&
      this.props.getSingleLocationPics({ id });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      const { id } = nextProps.match.params;
      this.props.getSingleLocationPics({ id });
    }
  }

  render() {
    const locationHeader = () => {
      return (
        <Card>
          <CardTitle
            title={
              <div
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
                  {this.props.locationData.name}
                </span>
              </div>
            }
          />
          <RaisedButton
            onTouchTap={() => {
              this.props.setCenter(
                this.props.locationData.lat,
                this.props.locationData.lng,
                19
              );
            }}
            label="Center map on this place"
            primary={true}
            style={styles.button}
            icon={<MapIcon />}
          />
        </Card>
      );
    };

    return <TabsWithContent header={locationHeader} />;
  }
}

function mapStateToProps(state) {
  return {
    locationData: state.insta.locationData
  };
}

export default withRouter(
  connect(mapStateToProps, { getSingleLocationPics, setCenter })(Location)
);
