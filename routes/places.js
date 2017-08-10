const PlacesController = require('../controllers/places')

module.exports = (app) => {
  const placesController = new PlacesController(/* app.datasource.models.Books */);

  app.route('/places')
    .post((req, res) => {
        placesController
            .apiPlaces(req.body)
            .then(response => {
                res.status(response.statusCode)
                res.json(response.data)
            })
    })

  app.route('/single-location-pics')
    .post((req, res) => {
        placesController
            .apiSingleLocation(req.body)
            .then(response => {
                res.status(response.statusCode)
                res.json(response.data)
            })        
    })

  app.route('/multi-location-pics')
    .post((req, res) => {
                console.log(req.body)
        placesController
            .apiMultiLocation(req.body)
            .then(response => {
                res.status(response.statusCode)
                res.json(response.data)
            })        
    })

  app.route('/user-info').post((req, res) => {
        placesController
            .apiUserProfile(req.body)
            .then(response => {
                res.status(response.statusCode)
                res.json(response.data)
            })
    })

  app.route('/post-info')
    .post((req, res) => {
        placesController
            .apiPhotoInfo(req.body)
            .then(response => {
                res.status(response.statusCode)
                res.json(response.data)
            })        
    })

  app.route('/tag-info')
    .post((req, res) => {
        placesController
            .apiTagInfo(req.body)
            .then(response => {
                res.status(response.statusCode)
                res.json(response.data)
            })        
    })

 


};
