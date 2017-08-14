const HttpStatus = require("http-status");
const axios = require("axios");
const _ = require("lodash");

const defaultResponse = (data, statusCode = HttpStatus.OK) => ({
  data,
  statusCode
});

const errorResponse = (message, statusCode = HttpStatus.BAD_REQUEST) =>
  defaultResponse(
    {
      error: message
    },
    statusCode
  );

function distance(lat1, lon1, lat2, lon2, unit) {
  var radlat1 = Math.PI * lat1 / 180;
  var radlat2 = Math.PI * lat2 / 180;
  var theta = lon1 - lon2;
  var radtheta = Math.PI * theta / 180;
  var dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = dist * 180 / Math.PI;
  dist = dist * 60 * 1.1515;
  if (unit == "K") {
    dist = dist * 1.609344;
  }
  if (unit == "N") {
    dist = dist * 0.8684;
  }
  return dist;
}

class placesController {
  //   constructor(Books) {
  //     this.Books = Books;
  //   }
  async apiPlaces(request) {
    let { accessToken, lat, lng, radius } = request;
    try {
      let res = await this.facebookPlaces(accessToken, lat, lng, radius);
      return defaultResponse(res);
    } catch (e) {
      return errorResponse(e.message);
    }
  }

  async apiSingleLocation(request) {
    try {
      let res = await this.instagramSingleLocationPics(request);
      return defaultResponse(res);
    } catch (e) {
      return errorResponse(e.message);
    }
  }

  async apiMultiLocation(request) {
    let { accessToken, centerLat, centerLng, radius } = request;
    try {
      let placeList = await this.facebookPlaces(
        accessToken,
        centerLat,
        centerLng,
        radius
      );
      let picsList = await this.instagramMultiLocationPics(placeList);
      let recentPicsSorted = this.instagramFilterRecentPics(picsList, 4); // using 4 hours as time
      return defaultResponse(recentPicsSorted);
    } catch (e) {
      return errorResponse(e.message);
    }
  }

  async apiUserProfile(request) {
    let { username } = request;
    try {
      let res = await this.instagramUserInfo(username);
      return defaultResponse(res);
    } catch (e) {
      return errorResponse(e.message);
    }
  }

  async apiPhotoInfo(request) {
    let { photoId } = request;
    try {
      let res = await this.instagramPicInfo(photoId);
      return defaultResponse(res);
    } catch (e) {
      return errorResponse(e.message);
    }
  }

  async apiTagInfo(request) {
    let { tag } = request;
    try {
      let res = await this.instagramTagInfo(tag);
      return defaultResponse(res);
    } catch (e) {
      return errorResponse(e.message);
    }
  }

  facebookPlaces(accessToken, lat, lng, radius) {
    return axios
      .get("https://graph.facebook.com/v2.9/search", {
        params: {
          type: "place",
          // q: term,
          center: `${lat},${lng}`,
          distance: radius,
          fields: "name,checkins,location",
          access_token: accessToken
        }
      })
      .then(response => {
        return response.data.data;
      })
      .then(placesArray => {
        let cleanArray = placesArray.filter(place => {
          let placeLat = place.location.latitude;
          let placeLng = place.location.longitude;
          let distanceFromCenter = distance(lat, lng, placeLat, placeLng, "K");
          return distanceFromCenter < radius * 1.2 / 1000;
        });
        return cleanArray;
      })
      .then(result => result)
      .catch(error => new Error(error.message));
    // .catch(error => console.log(error))
  }

  facebookPlaceInfo(id) {}

  instagramSingleLocationPics(location, multi_pics_option) {
    return axios
      .get(`https://www.instagram.com/explore/locations/${location.id}/`)
      .then(result => {
        let html = result.data;
        let startMark = "window._sharedData = ";
        let endMark1 = 'show_app_install": true}';
        let endMark2 = 'show_app_install": false}';
        let startPos = html.search(startMark) + startMark.length;
        let endPos = html.search(endMark1) + endMark1.length;
        let instaString = html.slice(startPos, endPos);
        let instaJson = JSON.parse(instaString);
        let locationData = instaJson.entry_data.LocationsPage[0].location;
        if (!multi_pics_option) {
          locationData.idOriginal = location.id;
          return locationData;
        }
        let picsArray = locationData.media.nodes;
        let picsArrayFiltered = picsArray.map(node => {
          let cleanNode = _.pick(node, [
            "id",
            "date",
            "thumbnail_src",
            "caption",
            "code",
            "owner.id",
            "comments.count",
            "likes.count"
          ]);
          cleanNode.location = {
            name: locationData.name,
            idOriginal: location.id,
            id: locationData.id,
            slug: locationData.slug,
            lat: locationData.lat,
            lng: locationData.lng
          };
          return cleanNode;
        });
        return picsArrayFiltered;
      })
      .catch(error => null);
  }

  instagramMultiLocationPics(data) {
    // 'data' is an array of facebook places
    return Promise.all(
      data.map(place => this.instagramSingleLocationPics(place, true))
    ).then(picsInfoMultiArray => {
      // makes an array of an 'array of pics' be only one array of many pics
      let flattened = _.flatten(picsInfoMultiArray);
      // removes falsey values from the array
      let compacted = _.compact(flattened);
      return compacted;
    });
  }

  instagramFilterRecentPics(data, time) {
    // data is an array of instagram pics object. time is the time in hours
    let now = Date.now() / 1000;
    let timeWindow = time * 60 * 60;
    let recent = data.filter(pic => pic.date > now - timeWindow);
    let sorted = recent.sort(function(a, b) {
      return b.date - a.date;
    });
    return sorted;
  }

  instagramPicInfo(id) {
    return axios
      .get(`https://www.instagram.com/p/${id}/`)
      .then(result => {
        let html = result.data;
        let startMark = "window._sharedData = ";
        let endMark1 = 'show_app_install": true}';
        let endMark2 = 'show_app_install": false}';
        let startPos = html.search(startMark) + startMark.length;
        let endPos = html.search(endMark1) + endMark1.length;
        let instaString = html.slice(startPos, endPos);
        let instaJson = JSON.parse(instaString);
        let postData = instaJson.entry_data.PostPage[0].graphql.shortcode_media;
        return postData;
        // return profileData
        // let name = locationData.name
        // let lat = locationData.lat
        // let lng = locationData.lng
        // let picsArray = locationData.media.nodes
        // let picsArrayFiltered = picsArray.map(node => {
        //     let cleanNode = _.pick(node,['date', 'thumbnail_src', 'caption', 'code', 'owner.id'])
        //     cleanNode.name = name
        //     cleanNode.lat = lat
        //     cleanNode.lng = lng
        //     return cleanNode
        // })
        // return picsArrayFiltered
      })
      .catch(error => null);
  }

  instagramUserInfo(username) {
    return axios
      .get(`https://www.instagram.com/${username}/`)
      .then(result => {
        let html = result.data;
        let startMark = "window._sharedData = ";
        let endMark1 = 'show_app_install": true}';
        let endMark2 = 'show_app_install": false}';
        let startPos = html.search(startMark) + startMark.length;
        let endPos = html.search(endMark1) + endMark1.length;
        let instaString = html.slice(startPos, endPos);
        let instaJson = JSON.parse(instaString);
        let profileData = instaJson.entry_data.ProfilePage[0].user;
        return profileData;
        // let name = locationData.name
        // let lat = locationData.lat
        // let lng = locationData.lng
        // let picsArray = locationData.media.nodes
        // let picsArrayFiltered = picsArray.map(node => {
        //     let cleanNode = _.pick(node,['date', 'thumbnail_src', 'caption', 'code', 'owner.id'])
        //     cleanNode.name = name
        //     cleanNode.lat = lat
        //     cleanNode.lng = lng
        //     return cleanNode
        // })
        // return picsArrayFiltered
      })
      .catch(error => null);
  }

  instagramTagInfo(tag) {
    return axios
      .get(`https://www.instagram.com/explore/tags/${tag}/`)
      .then(result => {
        let html = result.data;
        let startMark = "window._sharedData = ";
        let endMark1 = 'show_app_install": true}';
        let endMark2 = 'show_app_install": false}';
        let startPos = html.search(startMark) + startMark.length;
        let endPos = html.search(endMark1) + endMark1.length;
        let instaString = html.slice(startPos, endPos);
        let instaJson = JSON.parse(instaString);
        let tagData = instaJson.entry_data.TagPage[0].tag;
        return tagData;
        // let name = locationData.name
        // let lat = locationData.lat
        // let lng = locationData.lng
        // let picsArray = locationData.media.nodes
        // let picsArrayFiltered = picsArray.map(node => {
        //     let cleanNode = _.pick(node,['date', 'thumbnail_src', 'caption', 'code', 'owner.id'])
        //     cleanNode.name = name
        //     cleanNode.lat = lat
        //     cleanNode.lng = lng
        //     return cleanNode
        // })
        // return picsArrayFiltered
      })
      .catch(error => null);
  }
}

module.exports = placesController;
