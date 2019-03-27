var express = require('express');
var request = require('request');
var jsonxml = require('jsontoxml');
var app = express();

app.get('/', function(req, res) {
    res.type('Content-Type', 'text/xml');
    request.get({ url: "http://api.wbur.org/events", json: "true" }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          res.send(jsonxml(body));
        }
    });
});

app.set('port', process.env.PORT || 8000);
app.listen(app.get('port'));
console.log("The server is now running on port " + app.get('port'));
