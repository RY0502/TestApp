var http = require('http');

exports.dataURLs = function (callback) {
    http.get('http://api.football-data.org/v1/competitions/467', resp => {
        let data = '';
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });
        // The whole response has been received.
        resp.on('end', () => {
            var result = JSON.parse(data);
            setTimeout(callback, 10000, data);
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}