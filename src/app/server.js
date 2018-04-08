// server.js
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const app = express();
const compression = require('compression');

const forceSSL = function () {
  return function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(
        ['https://', req.get('Host'), req.url].join('')
      );
    }
    next();
  }
};


app.use(compression());
app.use(express.static(__dirname + '/dist'));
// Start the app by listening on the default
// Heroku port
app.listen(process.env.PORT || 4200, function () {
  console.log('Listening on port ' + this.address().port); //Listening on port 8888
});
