# Instagram Maps 

_No longer works due to Facebook changes to "places" ids in its Graph API._



Until 2017 "Places" registered in Facebook, shared the same ID of Instagram "Locations", so using the Google Maps API, it was possible to create an interactive map loading all locations in a region and gathering all public Instagram pictures from them.

App logic:

- User logs in with Facebook Oauth.
- Browser requests a Facebook Graph API access token, then send it to the server.
- Browser requests user location, so Google Maps can show the map of the user region.
- Maps API can get the "corners" of the current map (latitude and longitude), so it is possible to calculate the radius from the center and use this information to search in the Facebook Graph API for places in the selected area.
- The information returned from the API contains the ID of each place. These IDs are sent to the server.
- When requested by the client (browser) the server sends many simultaneous requests to Instagram website (each location page) and each response contains a large JSON in the script tag.
- This JSON contains all information about the location and photos taken there.
- The server extracts, filters and organizes the information and send back to the client to render on the screen.

Frontend (Web):

- React
- Redux, Redux-Thunk
- Google Maps API
- Google Maps React Component
- Facebook Oauth
- Material Design Lite
- Rx.js

Backend:

- Node.js
- Express.js
- Axios


Actions:

- Get recent photos in the map area.
- Get single location photos (when clicked in the map icon)
- Get user photos
- Get tag photos


Internals:

- Rx.js debounceTime and distinctUntilChanged functions are used to avoid excessive/unnecessary requests to Facebook/Instagram when the user navigates in the map.
- Auto managed to keep a valid access token for the requests.
- Hashtags in the comments are converted to links.

