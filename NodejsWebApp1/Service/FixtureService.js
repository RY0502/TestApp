var fixtureDb = require('../Database');

exports.getFixtures = function (req, res) {
    var fixtures = fixtureDb.getFixtures.getFixturesFromDb(function (data) {
        var fixtureObj = JSON.parse(data);
        res.send(fixtureObj);
    });
}