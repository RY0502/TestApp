var teamDb = require('../Database');

exports.getTeams = function (req, res) {
    var teams = teamDb.getTeams.getTeamsFromDb(function (data) {
        res.send(data);
    });
}