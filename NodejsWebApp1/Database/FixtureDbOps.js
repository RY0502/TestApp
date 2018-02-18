var dbModels = require('./Model');
//var connectionObj = require('./Connection');

exports.getFixturesFromDb = function (callback) {
    var fixturesArr = [];
    dbModels.dbFixtureModel.fixtureModel.find(function (err, fixtures) {
        if (err) {
            return console.error(err);
        }
        callback(JSON.stringify(fixtures));
    })
}