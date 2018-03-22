var dbModels = require('./Model');

exports.getPlayersFromDb = function (callback) {
    dbModels.dbPlayerModel.playerModel.find(function (err, players) {
        if (err) {
            return console.error(err);
        }
        callback(players);
    })
}