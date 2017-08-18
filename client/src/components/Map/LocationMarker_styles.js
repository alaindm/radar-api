// const K_WIDTH = 40;
// const K_HEIGHT = 40;
const K_SIZE = 40;

const locationMarkerStyle = {
  // initially any map object has left top corner at lat lng coordinates
  // it's on you to set object origin to 0,0 coordinates
  position: 'absolute',
  width: K_SIZE,
  height: K_SIZE,
  left: -K_SIZE / 2,
  top: -K_SIZE / 2,

  border: '5px solid #f44336',
  borderRadius: K_SIZE,
  backgroundColor: 'white',
  textAlign: 'center',
  color: '#3f51b5',
  fontSize: 12,
  fontWeight: 'bold',
  padding: 4,
  cursor: 'pointer'
};

const locationMarkerStyleHover = {
  ...locationMarkerStyle,
  border: '5px solid #3f51b5',
  color: '#f44336'
};

export {locationMarkerStyle, locationMarkerStyleHover, K_SIZE};
