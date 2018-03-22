var reqUtil = require('../Utils');
var request = require('request');
//var async = require('async');
var db = require('../Database');
var XLSX = require('xlsx');

exports.extractAndSaveData = function (req, res) {
    reqUtil.requestUtil.getDataFromURL('http://api.football-data.org/v1/competitions/467', res, saveFixtures);
}

function saveFixtures(res, urlObject) {
    var fixtureUrl = urlObject._links.fixtures.href;
    var saveFixturesToDB = function (resObj, fixturesObject) {
        var fixtureData = fixturesObject.fixtures;
        db.dbBuilderOps.saveFixturesToDB(fixtureData, function () {
            saveTeams(resObj, urlObject);
        })
     }
    reqUtil.requestUtil.getDataFromURL(fixtureUrl, res, saveFixturesToDB);
}

function saveTeams(res, urlObject) {
    var teamUrl = urlObject._links.teams.href;
    var saveTeamsToDB = function (resObj, teamObject) {
        var teamData = teamObject.teams;
        db.dbBuilderOps.saveTeamsToDB(teamData, function (savedTeams) {
            savePlayers(resObj, savedTeams);
        })
    }
    reqUtil.requestUtil.getDataFromURL(teamUrl, res, saveTeamsToDB);
}

    function savePlayers(resp, teams) {
        var workbook = XLSX.readFile(__dirname + '/../resources/player.xlsx');
        var teamPlayerMap = {};
        for (var i = 0; i < teams.length; i++) {
            var team = teams[i];
            if (teamPlayerMap[team.name] == undefined) {
                teamPlayerMap[team.name] = [];
            }

        }
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

                if (!data[row]) {
                    data[row] = {};
                    if (row > 2) {
                        var playerObj = data[row - 1];
                        if (teamPlayerMap[playerObj.country] != undefined) {
                            teamPlayerMap[playerObj.country].push(playerObj);
                        }
                    }
                }
                if (headers[col] == 'positionpreferred') {
                    var newVal = value.replace(/ /g, ", ");
                    data[row][headers[col]] = newVal;
                } else {
                    data[row][headers[col]] = value;
                }
            }
        db.dbBuilderOps.savePlayersToDB(teamPlayerMap, function (savedPlayers) {
            //console.log(savedPlayers);
            resp.write("Successfully build DB");
            resp.end();
        });

    }