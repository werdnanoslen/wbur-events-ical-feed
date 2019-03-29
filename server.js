var http = require('http');
var request = require('request');
const ical = require('ical-generator');
const cal = ical({domain: 'heroku.com', name: 'WBUR Events'});

var server = http.createServer(function(req, res) {
    request.get({ url: "http://api.wbur.org/events", json: "true" }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            for (var i = 0; i < body.body.length; ++i) {
                var thisBody = body.body[i];
                cal.createEvent({
                    start: thisBody.start,
                    end: thisBody.end,
                    description: thisBody.content,
                    location: thisBody.venue,
                    url: thisBody.ticketURL
                });
            }
            cal.serve(res);
        }
    });
}).listen(process.env.PORT || 8000, 'localhost', function() {
    var url = server.address().address + ':' + server.address().port;
    console.log('Server running at ' + url);
});
