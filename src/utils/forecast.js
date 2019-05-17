const request = require('request');

const token = process.env.WEATHER_TOKEN;

const forecast = (lat, long, callback) => {
  const url = `https://api.darksky.net/forecast/${token}/${lat},${long}?units=si`;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback('Unable to connect to weather service!');
    } else if (body.error) {
      callback('Unable to fetch weather for that location!');
    } else {
      callback(undefined, `${body.currently.summary}. It is currently ${body.currently.temperature}°C. There is a ${body.currently.precipProbability}% chance of rain.`);
    }
  });
};

module.exports = {
  forecast,
};
