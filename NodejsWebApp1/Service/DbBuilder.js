//var http = require('http');
var reqUtil = require('../Utils');
var request = require('request');
//var async = require('async');
//var Team = require('../Model/Team');
var dbModels = require('../Database/Model');
var db = require('../Database');

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

//exports.getTeamData = function (url, callback) {
//    request(url, function (err, resp, body) {
//        if (err) { console.log(err); callback(true); return; }
//        let teamArr = new Array;
//        teamArr = JSON.parse(body).teams;
//        teamArr.forEach(res => {
//            // console.log(res);
//            saveTeamData(res, function (err, data) { })
//        })
//        callback(false, teamArr);
//    })
//}

//saveTeamData = function (team, callback) {
//    Team.create({
//        name: team.name,
//        code: team.code,
//        crestUrl: team.crestUrl
//    },
//        function (err, team) {
//            // if (err) return res.status(500).send("There was a problem adding the information to the database.");
//            callback(err, team);
//        })
//}

exports.extractAndSaveData = function (req, res) {
    reqUtil.requestUtil.getDataFromURL('http://api.football-data.org/v1/competitions/467', res, saveFixtures);
}

function saveFixtures(res, urlObject) {
    var fixtureUrl = urlObject._links.fixtures.href;
    reqUtil.requestUtil.getDataFromURL(fixtureUrl, res, saveFixturesToDB);
}

function saveFixturesToDB(resp, fixturesObject) {
    var fixtureData = fixturesObject.fixtures;
    var fixturesLength = fixtureData.length;
    db.dbConnection.connect;
    for(var i = 0; i < fixturesLength; i++) {
        var fixture = fixtureData[i];
        dbModels.dbFixtureModel.fixtureModel.create({
            matchday: fixture.matchday,
            status: fixture.status,
            matchdate: fixture.date,
            teamhome: fixture.homeTeamName,
            teamaway: fixture.awayTeamName,
            result: [{ teamhomegoal: null, teamawaygoal: null }]
        },
            function (err, fixture) {
                if (err) return res.status(500).send("There was a problem adding the information to the database.");
                console.log(fixture);
        });
    }
    resp.end();
}