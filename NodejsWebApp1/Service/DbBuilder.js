var http = require('http');
var request = require('request');
var async = require('async');
var Team = require('../Model/Team');

exports.dataURLs = function (callback) {
    http.get('http://api.football-data.org/v1/competitions/467',
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
                callback(null, data);
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
}

exports.getTeamData = function (url, callback) {
    request(url, function (err, resp, body) {
        if (err) { console.log(err); callback(true); return; }
        let teamArr = new Array;
        teamArr = JSON.parse(body).teams;
        teamArr.forEach(res => {
            // console.log(res);
            saveTeamData(res, function (err, data) { })
        })
        callback(false, teamArr);
    })
}

saveTeamData = function (team, callback) {
    Team.create({
        name: team.name,
        code: team.code,
        crestUrl: team.crestUrl
    },
        function (err, team) {
            // if (err) return res.status(500).send("There was a problem adding the information to the database.");
            callback(err, team);
        })
}

