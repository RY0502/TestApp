var dbModels = require('./Model');

exports.saveFixturesToDB = function (fixtureData, callback) {
    var fixturesLength = fixtureData.length;
    for (var i = 0; i < fixturesLength; i++) {
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
    callback();
}