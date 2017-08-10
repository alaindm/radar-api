var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const cors = require('cors')
const _ = require('lodash')
const placesRouter = require('./routes/places')

// remove later********************
const axios = require('axios')

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())
app.use(express.static(path.join(__dirname, 'insta-front-vanilla_js')));

placesRouter(app)


function distance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist
}

app.get('/placesold', function(req, res, next) {
  accessToken = req.query.token
  lat = req.query.lat
  lng = req.query.lng
  radius = req.query.radius 
  if(req.query.token && req.query.lat && req.query.lng && req.query.radius) {
    getFbPlaces(accessToken, lat, lng, radius)
    .then(placesArray => {
      cleanArray = placesArray.filter(place => {
        placeLat = place.location.latitude
        placeLng = place.location.longitude
        var distanceFromCenter = distance(lat, lng, placeLat, placeLng, "K")
        return distanceFromCenter < (radius * 1.2 / 1000);
      })      
      return Promise.all(cleanArray.map(place => getInstagramLocationInfo(place)))
    })
    .then(picsInfoMultiArray => {
      flattened = _.flatten(picsInfoMultiArray)
      compacted =  _.compact(flattened)
      var now = Date.now()/1000
      var timeWindow = 1 * 60 * 60 // 1 hour
      var recent = compacted.filter(node => node.date > (now - timeWindow))
      var sorted = recent.sort(function(a,b){
        return b.date - a.date
      })
      // console.log(recent)
      res.send({data: sorted})
      // res.json({data: ['123', '346']})  
    })
    .catch(error => {
      console.log(error)
      res.status(500).send(error)
    })
  } else {
    res.status(404).send('erro')
  }
})      

app.get('/test', function(req, res, next) {
    res.json({data: ['123', '346']})  
})  

// given the params, return an array of location ids
getFbPlaces = (accessToken, lat, lng, radius) => {
  return axios.get('https://graph.facebook.com/v2.9/search', {
        params: {
          type: 'place',
          // q: term,
          center: `${lat},${lng}`,
          distance: radius,
          fields: 'name,checkins,location',
          access_token: accessToken
        }
      })
      .then(response => {
        return Promise.resolve(response.data.data)
      })
      .catch(error => Promise.reject(error))  
}

getInstagramLocationInfo = (location) => {  
  return axios.get(`https://www.instagram.com/explore/locations/${location.id}/`)
    .then(resp => {      
      var html = resp.data
      var startMark = 'window._sharedData = '
      var endMark1 = 'show_app_install": true}'
      var endMark2 = 'show_app_install": false}'
      var startPos = html.search(startMark) + startMark.length
      var endPos = html.search(endMark1) + endMark1.length
      var instaString = html.slice(startPos, endPos)
      var instaJson = JSON.parse(instaString)
      var locationData = instaJson.entry_data.LocationsPage[0].location
      name = locationData.name
      lat = locationData.lat
      lng = locationData.lng
      picsArray = locationData.media.nodes      
      picsArrayFiltered = picsArray.map(node => {
        cleanNode = _.pick(node,['date', 'thumbnail_src', 'caption', 'code', 'owner.id'])
        cleanNode.name = name
        cleanNode.lat = lat
        cleanNode.lng = lng
        return cleanNode
      })
      return picsArrayFiltered
    })
    .catch(error => null)  
}


module.exports = app;
