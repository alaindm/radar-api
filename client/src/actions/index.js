/*global FB*/
/*global google*/
import axios from "axios";
import {
  GET_PLACES,
  GET_SINGLE_LOCATION_PICS,
  GET_MULTI_LOCATION_PICS,
  GET_USER_INFO,
  GET_POST_INFO,
  GET_TAG_INFO,
  API_ERROR,
  SET_ACCESS_TOKEN,
  SET_CENTER,
  GET_MAP_STATE,
  SET_TAB,
  SET_LOADING,
  CLEAN_PICS,
  CLEAN_POST
} from "./types";

export function setTab(tab) {
  return {
    type: SET_TAB,
    payload: tab
  };
}

export function logFBplaces() {
  return (dispatch, getState) => {
    manageFbPermission(dispatch, getState)
      .then(() => {
        let { accessToken, mapState } = getState().insta;
        let { lat, lng } = mapState.center;
        let wrappedCenter = new google.maps.LatLng(lat, lng);
        let centerLat = wrappedCenter.lat();
        let centerLng = wrappedCenter.lng();
        let { ne } = mapState.bounds;
        let wrappedCorner = new google.maps.LatLng(ne.lat, ne.lng);
        let cornerLat = wrappedCorner.lat();
        let cornerLng = wrappedCorner.lng();
        let radius =
          1000 * distance(centerLat, centerLng, cornerLat, cornerLng, "K");
        // console.log(centerLat, centerLng, cornerLat, cornerLng)
        // console.log(radius)
        // dispatch({type: SET_LOADING})
        return FB.api(
          "/search",
          "get",
          {
            type: "place",
            // q: term,
            center: `${centerLat},${centerLng}`,
            distance: radius,
            fields: "name,checkins,location",
            access_token: accessToken
          },
          response => {
            if (response.error) {
              return dispatch({
                type: API_ERROR,
                payload: response.error
              });
            }
            dispatch({
              type: GET_PLACES,
              data: response
            });
            // return console.log('FB.api', response)
          }
        );
      })
      .catch(() => dispatch(apiError("Could not get the places")));
    // .catch(e => console.log(e))
  };
}

export const getPlaces = (lat, lng, radius) => {
  let accessToken;
  return axios
    .post(`/api/places`, { accessToken, lat, lng, radius })
    .then(response => response)
    .catch(error => error);
};

export const getSingleLocationPics = location => {
  // location must have an 'id' property
  return (dispatch, getState) => {
    dispatch({ type: SET_LOADING });
    dispatch({ type: CLEAN_PICS });
    axios
      .post(`/api/single-location-pics`, location)
      .then(response => {
        dispatch({
          type: GET_SINGLE_LOCATION_PICS,
          pics: response.data ? response.data.media.nodes : [],
          locationData: response.data || {}
        });
        // dispatch({
        //     type: CHANGE_SIDEPANE,
        //     payload: 'location'
        // })
      })
      // .catch(() => dispatch(apiError('Could not get the location photos')))
      .catch(e => console.log(e));
  };
};

export function getMultiLocationPics() {
  return (dispatch, getState) => {
    manageFbPermission(dispatch, getState)
      .then(() => {
        let { accessToken, mapState } = getState().insta;
        let { lat, lng } = mapState.center;
        let wrappedCenter = new google.maps.LatLng(lat, lng);
        let centerLat = wrappedCenter.lat();
        let centerLng = wrappedCenter.lng();
        let { ne } = mapState.bounds;
        let wrappedCorner = new google.maps.LatLng(ne.lat, ne.lng);
        let cornerLat = wrappedCorner.lat();
        let cornerLng = wrappedCorner.lng();
        let radius =
          1000 * distance(centerLat, centerLng, cornerLat, cornerLng, "K");
        dispatch({ type: CLEAN_PICS });
        dispatch({ type: SET_LOADING });
        // must send with this names
        return axios.post(`/api/multi-location-pics`, {
          accessToken,
          centerLat,
          centerLng,
          radius
        });
      })
      .then(response => {
        dispatch({
          type: GET_MULTI_LOCATION_PICS,
          payload: response.data.slice(1, 7)
        });
        // dispatch({
        //     type: CHANGE_SIDEPANE,
        //     payload: 'region'
        // })
      })
      .catch(() => dispatch(apiError("Could not get the region photos")));
    // .catch(e => console.log(e));
  };
}

export const getUserInfo = username => {
  return dispatch => {
    dispatch({ type: SET_LOADING });
    dispatch({ type: CLEAN_PICS });
    axios
      .post(`/api/user-info`, { username })
      .then(response =>
        dispatch({
          type: GET_USER_INFO,
          data: response.data,
          pics: response.data.media.nodes
        })
      )
      .catch(() => dispatch(apiError("Could not get the user information")));
  };
};

export const getPostInfo = photoId => {
  return dispatch => {
    dispatch({ type: SET_LOADING });
    dispatch({ type: CLEAN_POST });
    axios
      .post(`/api/post-info`, { photoId })
      .then(response =>
        dispatch({
          type: GET_POST_INFO,
          data: response.data
        })
      )
      .catch(() => dispatch(apiError("Could not get the post info")));
    // .catch(e => console.log(e))
  };
};

export const cleanPostData = () => {
  return {
    type: CLEAN_POST
  };
};

export const getTagInfo = tag => {
  return dispatch => {
    dispatch({ type: SET_LOADING });
    dispatch({ type: CLEAN_PICS });
    axios
      .post(`/api/tag-info`, { tag })
      .then(response =>
        dispatch({
          type: GET_TAG_INFO,
          data: response.data,
          pics: response.data.media.nodes
        })
      )
      .catch(() => dispatch(apiError("Could not get the tag photos")));
  };
};

export function apiError(error) {
  return {
    type: API_ERROR,
    payload: error
  };
}

function manageFbPermission(dispatch, getState) {
  return new Promise((resolve, reject) => {
    let { accessToken, accessTokenExpirationTime } = getState().insta;
    if (!accessToken) {
      FB.getLoginStatus(response => {
        if (response.status === "connected") {
          setAccessTokenState(dispatch, response);
          return resolve();
        } else {
          return doFbLogin(dispatch)
            .then(() => resolve())
            .catch(() => reject("Not authorized"));
        }
      });
    } else if (Date.now() > accessTokenExpirationTime) {
      setAccessTokenState(dispatch);
      manageFbPermission(dispatch, getState);
    } else {
      return resolve();
    }
  });
}

function setAccessTokenState(dispatch, response = null) {
  if (response) {
    let expirationTimeCalc =
      Date.now() + response.authResponse.expiresIn * 1000;
    dispatch({
      type: SET_ACCESS_TOKEN,
      payload: {
        accessToken: response.authResponse.accessToken,
        accessTokenExpirationTime: expirationTimeCalc
      }
    });
  } else {
    dispatch({
      type: SET_ACCESS_TOKEN,
      payload: {
        accessToken: null,
        accessTokenExpirationTime: null
      }
    });
  }
}

function doFbLogin(dispatch) {
  return new Promise((resolve, reject) => {
    FB.login(
      response => {
        if (response.status === "connected") {
          setAccessTokenState(dispatch, response);
          return resolve();
        } else {
          // dispatch({
          //     type: CHANGE_SIDEPANE,
          //     payload: 'please-connect'
          // })
          // .then(() => reject())
        }
      },
      { scope: "public_profile" }
    );
  });
}

export function setCenter(lat, lng, zoom) {
  return (dispatch, getState) => {
    if (!zoom) {
      zoom = getState().insta.mapState.zoom;
    }
    return dispatch({
      type: SET_CENTER,
      payload: [lat, lng, zoom]
    });
  };
}

export function setLoading() {
  return {
    type: SET_LOADING
  };
}

export function getMapState(mapState) {
  return dispatch => {
    dispatch({
      type: GET_MAP_STATE,
      payload: mapState
    });
  };
}

function distance(lat1, lon1, lat2, lon2, unit) {
  let radlat1 = Math.PI * lat1 / 180;
  let radlat2 = Math.PI * lat2 / 180;
  let theta = lon1 - lon2;
  let radtheta = Math.PI * theta / 180;
  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = dist * 180 / Math.PI;
  dist = dist * 60 * 1.1515;
  if (unit === "K") {
    dist = dist * 1.609344;
  }
  if (unit === "N") {
    dist = dist * 0.8684;
  }
  // if (unit=="K") { dist = dist * 1.609344 }
  // if (unit=="N") { dist = dist * 0.8684 }
  return dist;
}

export function goToRegion(history, lat, lng, zoom) {
  return dispatch => {
    dispatch({ type: CLEAN_PICS });
    dispatch({
      type: SET_CENTER,
      payload: [lat, lng, zoom]
    });
    history.push("/region");
  };
}

export function zoomToArea(address, zoom) {
  // Get the address or place that the user entered.
  return (dispatch, getState) => {
    // Initialize the geocoder.
    // dispatch({ type: CLEAN_PICS });
    let geocoder = new google.maps.Geocoder();
    // Make sure the address isn't blank.
    if (address === "") {
      // if (address == '') {
      //   dispatch({
      //       type: CHANGE_SIDEPANE,
      //       payload: 'error' // You must enter an area, or address.
      //   })
    } else {
      // Geocode the address/area entered to get the center. Then, center the map
      // on it and zoom in
      geocoder.geocode({ address }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          //   if (status == google.maps.GeocoderStatus.OK) {
          zoom || (zoom = getState().insta.mapState.zoom);
          dispatch({
            type: SET_CENTER,
            payload: [
              results[0].geometry.location.lat(),
              results[0].geometry.location.lng(),
              zoom
            ]
          });
          // call the api
        } else {
          // dispatch({
          //     type: CHANGE_SIDEPANE,
          //     payload: 'about' // We could not find that location - try entering a more' + ' specific place.
          // })
        }
      });
    }
  };
}
