const axios = require('axios').default;

const geocode = (adress, callback) => {
  const url =
    'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
    encodeURIComponent(adress) +
    '.json?access_token=pk.eyJ1IjoicGVkcm9tYW51ZWwtcm9zc2kiLCJhIjoiY2t5ZHNiNXljMDh5dDJucTkycGtlb3RjdSJ9.M99Q7EoD4P5g7yAkMTGsKw&limit=1';

  axios
    .get(url)
    .then(function (response) {
      placename = response.data.features[0].text;
      latitude = response.data.features[0].center[1];
      longitude = response.data.features[0].center[0];

      callback({
        latitude: latitude,
        longitude: longitude,
        placename: placename,
      });
    })
    .catch(function (error) {
      if (error.response) {
        if (error.response.status == 404) {
          callback('A location must be entered in the query');
        }
      } else if (error.request) {
        callback(
          'It is not possible to connect to the geolocation data service'
        );
      } else if (error.message == "Cannot read property 'text' of undefined") {
        callback('The location that you searched for could not be found');
      } else {
        callback(error.message);
      }
    });
};

module.exports = geocode;
