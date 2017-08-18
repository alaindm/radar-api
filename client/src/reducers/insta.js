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
} from "../actions/types";

const initialState = {
  pics: [],
  error: "",
  loading: false,
  tab: "mosaic",
  placesData: {
    data: []
  },
  postData: {},
  locationData: {
    name: ""
  },
  mapState: {
    zoom: 15,
    center: {
      lat: 40.778746,
      lng: -73.967954
    }
  }
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_PLACES:
      return { ...state, error: "", placesData: action.data };
    case CLEAN_PICS:
      return { ...state, pics: [] };
    case CLEAN_POST:
      return { ...state, postData: {} };
    case GET_SINGLE_LOCATION_PICS:
      return {
        ...state,
        error: "",
        loading: false,
        locationData: action.locationData,
        pics: action.pics
      };
    case GET_MULTI_LOCATION_PICS:
      return { ...state, error: "", loading: false, pics: action.payload };
    case GET_USER_INFO:
      return {
        ...state,
        error: "",
        loading: false,
        userData: action.data,
        pics: action.pics
      };
    case GET_POST_INFO:
      return { ...state, error: "", loading: false, postData: action.data };
    case GET_TAG_INFO:
      return {
        ...state,
        error: "",
        loading: false,
        tagData: action.data,
        pics: action.pics
      };
    case API_ERROR:
      return { ...state, error: action.payload, loading: false, pics: [] };
    case SET_ACCESS_TOKEN:
      return {
        ...state,
        accessToken: action.payload.accessToken,
        accessTokenExpirationTime: action.payload.accessTokenExpirationTime
      };
    case SET_CENTER:
      return {
        ...state,
        mapState: {
          ...state.mapState,
          center: {
            lat: action.payload[0],
            lng: action.payload[1]
          },
          zoom: action.payload[2]
        }
      };
    case GET_MAP_STATE:
      return { ...state, mapState: action.payload };
    case SET_TAB:
      return { ...state, tab: action.payload };
    case SET_LOADING:
      return { ...state, loading: true };
    default:
      return state;
  }
}
