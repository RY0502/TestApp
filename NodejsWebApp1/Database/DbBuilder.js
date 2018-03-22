var dbModels = require('./Model');

exports.saveFixturesToDB = function (fixtureData, callback) {
    var fixturesLength = fixtureData.length;
    var fixtureArr = [];
    for (var i = 0; i < fixturesLength; i++) {
        var fixture = fixtureData[i];
        fixtureArr.push({
            matchday: fixture.matchday,
            status: fixture.status,
            matchdate: fixture.date,
            teamhome: fixture.homeTeamName,
            teamaway: fixture.awayTeamName,
            result: [{ teamhomegoal: null, teamawaygoal: null }]
        });
    }
    if (fixtureArr.length > 0) {
        dbModels.dbFixtureModel.fixtureModel.insertMany(fixtureArr,
            function (err, fixtures) {
                if (err) return res.status(500).send("There was a problem adding fixtures information to the database.");
                //console.log(fixtures);
                callback();
            });
    }
}

exports.saveTeamsToDB = function (teamData, callback) {
    var teamsLength = teamData.length;
    var teamArr = [];
    for (var i = 0; i < teamsLength; i++) {
        var team = teamData[i];
        teamArr.push({
            name: team.name,
            code: team.code,
            cresturl: team.crestUrl,
    });
    }
    if (teamArr.length > 0) {
        dbModels.dbTeamModel.teamModel.insertMany(teamArr,
            function (err, teams) {
                if (err) return res.status(500).send("There was a problem in adding team information to the database.");
                //console.log(teams);
                callback(teams);
            });
    }
}

exports.savePlayersToDB = function (playerData, callback) {
    var playersArr = [];
    for (var i in playerData) {
        for (var p = 0; p < playerData[i].length; p++) {
            var player = playerData[i][p];
            playersArr.push({
                name: player.name,
                preferredposition: player.positionpreferred,
                imagelink: player.playerimage,
                team: player.country
        });
    }
    }
    if (playersArr.length > 0) {
        dbModels.dbPlayerModel.playerModel.insertMany(playersArr,
            function (err, players) {
                if (err) return res.status(500).send("There was a problem adding players information to the database.");
                //console.log(players);
                callback();
            });
    }
}