var reqUtil = require('../Utils');
var request = require('request');
//var async = require('async');
var db = require('../Database');
var XLSX = require('xlsx');

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
    db.saveFixtures.saveFixturesToDB(fixtureData, function () {
        //Method call here for saving next in line team/player. Move reponse.end to the last method
        //resp.end();
        savePlayers(resp);
    })

    function savePlayers(resp) {
        var workbook = XLSX.readFile(__dirname+'/../resources/player.xlsx');
        var first_sheet_name = workbook.SheetNames[0]
        var worksheet = workbook.Sheets[first_sheet_name];
            var headers = {};
            var data = [];
            for (z in worksheet) {
                if (z[0] === '!') continue;
                //parse out the column, row, and value
                var tt = 0;
                for (var i = 0; i < z.length; i++) {
                    if (!isNaN(z[i])) {
                        tt = i;
                        break;
                    }
                };
                var col = z.substring(0, tt);
                var row = parseInt(z.substring(tt));
                var value = worksheet[z].v;

                //store header names
                if (row == 1 && value) {
                    headers[col] = value;
                    continue;
                }

                if (!data[row]) data[row] = {};
                data[row][headers[col]] = value;
            }
            //drop those first two rows which are empty
            data.shift();
            data.shift();
            console.log(data);

    }
}