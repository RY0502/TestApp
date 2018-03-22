var dbModels = require('./Model');

exports.getTeamsFromDb = function (callback) {
    dbModels.dbTeamModel.teamModel.find(function (err, teams) {
        if (err) {
            return console.error(err);
        }
        callback(teams);
    })
}