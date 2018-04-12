var fixtureDb = require('../Database');
var utils = require('../Utils');


exports.getFixtures = function (req, res) {
    var match = req.query.match;
    var fixtureToGet = '';

    if (match != undefined && match.trim() != '') {

        if (match == utils.constants.NEXT) {
            fixtureToGet = match;

        } else if (match == utils.constants.LAST) {
            fixtureToGet = match;
        }

    } else {
        fixtureToGet = 'all';
    }

    var fixtureFindPromise = fixtureDb.getFixtures.getFixturesFromDb(fixtureToGet);

    fixtureFindPromise.then(function (data) {
        res.send(data);
    }).catch(function (reason) {
            console.log('Fixture fetch failed with:', reason);
     });
    //var fixtures = fixtureDb.getFixtures.getFixturesFromDb(fixtureToGet, function (data) {
      //  res.send(data);
    //});
}