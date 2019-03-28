var express = require('express');
var request = require('request');
var jsonxml = require('jsontoxml');
var app = express();

app.get('/', function(req, res) {
    res.type('Content-Type', 'application/xml');
    request.get({ url: "http://api.wbur.org/events", json: "true" }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var wellFormed = {};
            for (var i = 0; i < body.body.length; ++i) {
                delete body.body[i].taxonomy;
                var thisBody = body.body[i];
                wellFormed[thisBody.id] = {
                  'title': thisBody.headline,
                  'content': thisBody.content + '\n\nGet tickets here: ' + thisBody.ticketURL,
                  'startTime': thisBody.start,
                  'endTime': thisBody.end,
                  'location': thisBody.venue
                }
            }
            xmlOptions = {
              'xmlHeader': true,
              'prettyPrint': true,
              'removeIllegalNameCharacters': true
            }
            res.send(jsonxml(wellFormed, xmlOptions));
        }
    });
});

app.set('port', process.env.PORT || 8000);
app.listen(app.get('port'));
console.log("The server is now running on port " + app.get('port'));
