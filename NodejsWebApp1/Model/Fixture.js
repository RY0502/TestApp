var mongoose = require('mongoose');

var FixtureSchema = mongoose.Schema({
    date: Date,
    status: String,
    matchday: Number,
    homeTeamName: String,
    awayTeamName: String,
    homeTeamScore: Number,
    awayTeamScore: Number
});
mongoose.model('Fixture', FixtureSchema);

module.exports = mongoose.model('Fixture');