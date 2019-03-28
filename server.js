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
                wellFormed[jsonxml.escape(thisBody.id)] = {
                  'title': jsonxml.escape(thisBody.headline),
                  'content': jsonxml.escape(thisBody.content + '\n\n Get tickets here: ' + thisBody.ticketURL),
                  'startTime': jsonxml.escape(thisBody.start),
                  'endTime': jsonxml.escape(thisBody.end),
                  'location': jsonxml.escape(thisBody.venue)
                }
            }
            xmlOptions = {
              'prettyPrint': true,
              'removeIllegalNameCharacters': true
            }
            var finalXml = '<root>' + jsonxml(wellFormed, xmlOptions) + '</root>';
            res.send(finalXml);
        }
    });
});

app.set('port', process.env.PORT || 8000);
app.listen(app.get('port'));
console.log("The server is now running on port " + app.get('port'));
