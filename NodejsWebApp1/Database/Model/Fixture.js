var mongoose = require('mongoose');

var FixtureSchema = mongoose.Schema({
    matchday: Number,
    status: String,
    matchdate: Date,
    teamhome: String,
    teamaway: String,
    result: [{ teamhomegoal: Number, teamawaygoal: Number }]
});

exports.fixtureModel = mongoose.model('Fixture', FixtureSchema);