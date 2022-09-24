const axios = require('axios').default;

const forecast = (latitude, longitude, callback) => {
  const weatherURL =
    'http://api.weatherstack.com/current?access_key=c25ae028b5639f539247632739910c49&query=' +
    latitude +
    ',' +
    longitude +
    '&units=f';

  axios
    .get(weatherURL, {
      validateStatus: (status) => {
        return status < 500;
      },
    })
    .then(function (response) {
      callback(
        `It is ${response.data.current.temperature} degrees out, it feels like ${response.data.current.feelslike} degrees out`
      );
    })
    .catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        callback({
          'Error Data': error.response.data,
          'Error Status': error.response.status,
          'Error Headers': error.response.headers,
        });
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        callback('It is not possible to connect to the weather data service');
      } else if (error.config == undefined) {
        callback({
          error: 'The location that you searched for was not found.',
        });
      } else {
        // Something happened in setting up the request that triggered an Error
        callback('Error', error.message);
      }
    });
};

module.exports = forecast;
