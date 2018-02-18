var fixtureDb = require('../Database');

exports.getFixtures = function (req, res) {
    var fixtures = fixtureDb.getFixtures.getFixturesFromDb(function (data) {
    res.write(data);
    res.end();
    });
}