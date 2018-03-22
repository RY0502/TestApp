var playerDb = require('../Database');

exports.getPlayers = function (req, res) {
    var players = playerDb.getPlayers.getPlayersFromDb(function (data) {
        res.send(data);
    });
}