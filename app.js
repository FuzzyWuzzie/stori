var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', function (req, res) {
  res.send('Hello stori!');
});

var server = app.listen(app.get('port'), function() {
  console.log('stori is running on port', app.get('port'));
});