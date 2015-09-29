var express = require('express');
var app = express();
var http = require('http').Server(app);

app.set('port', (process.env.PORT || 5000));

app.use(express.static('template'));

http.listen(app.get('port'), function(){
  console.log('listening on *:' + app.get('port'));
});