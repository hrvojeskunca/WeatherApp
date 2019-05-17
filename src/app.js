const path = require('path');
const express = require('express');
const hbs = require('hbs');

const app = express();
const port = process.env.PORT;

const { geocode } = require('./utils/geocode');
const { forecast } = require('./utils/forecast');

/* Define Paths for Express config */

const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

/* Setup handlebars engine and views location */

app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

/* Setup static directory to serve */

app.use(express.static(publicDirectoryPath));

/* INDEX */

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'Hrvoje Škunca',
  });
});

/* ABOUT */

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
    name: 'Hrvoje Škunca',
  });
});

/* HELP */

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    name: 'Hrvoje Škunca',
    helpText: 'This should be a helpful text.',
  });
});

/* WEATHER */

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({ error: 'You must provide an address!' });
  }

  geocode(req.query.address, (error, { lat, long, location } = {}) => {
    if (error) {
      return res.send({ error });
    }

    forecast(lat, long, (error, forecastData) => {
      if (error) {
        return res.send({ error });
      }

      res.send({
        location,
        forecast: forecastData,
        address: req.query.address,
      });
    });
  });
});

/* 404 */

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Hrvoje Škunca',
    errorMessage: 'Help Article Not Found!',
  });
});

app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Hrvoje Škunca',
    errorMessage: 'Page Not Found!',
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
