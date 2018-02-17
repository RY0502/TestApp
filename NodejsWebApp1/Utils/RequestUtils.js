var http = require('http');

exports.getDataFromURL = function (url, res, callback) {
    http.get(url,
        resp => {
            let data = '';
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });
            // The whole response has been received.
            resp.on('end', () => {
                var result = JSON.parse(data);
                // setTimeout(callback, 10000, data);
                if (res != null) {
                    callback(res, result);
                } else {
                    callback(result);
                }
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
}