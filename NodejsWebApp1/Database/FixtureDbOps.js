var dbModels = require('./Model');

exports.getFixturesFromDb = function (callback) {
    dbModels.dbFixtureModel.fixtureModel.find(function (err, fixtures) {
        if (err) {
            return console.error(err);
        }
        callback(fixtures);
    })
}