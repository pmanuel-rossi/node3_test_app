const path = require('path');
const express = require('express');
const hbs = require('hbs');

const forecast = require('./utils/forecast');
const geocode = require('./utils/geocode');

const app = express();

const port = process.env.PORT || 3000;

// Define Paths for Express Config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup Handlebars engine and location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather App',
    name: 'Pedro Rossi',
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About me',
    name: 'Pedro Rossi',
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    name: 'Pedro Rossi',
  });
});

app.get('/weather', (req, res) => {
  if (!req.query.adress) {
    return res.send({
      error: 'Please provide an adress',
    });
  }
  geocode(
    req.query.adress,
    ({ latitude, longitude, placename } = {}, error) => {
      if (error) {
        return res.send({
          error: error,
        });
      }

      forecast(latitude, longitude, (forecastData) => {
        if (error) {
          return res.send({
            error: 'Please provide an adress',
          });
        } else if (forecastData.error) {
          return res.send({
            error: forecastData.error,
          });
        }
        res.send({
          forecast: forecastData,
          location: placename,
        });
      });
    }
  );
});

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: 'Help',
    message: 'Help Article Not Found',
    name: 'Pedro Rossi',
  });
});

app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    message: 'Page Not Found',
    name: 'Pedro Rossi',
  });
});

app.listen(port, () => {
  console.log('Server is up on port' + port);
});
