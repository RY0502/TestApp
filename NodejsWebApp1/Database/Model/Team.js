var mongoose = require('mongoose');

var teamschema = mongoose.schema({
    name: string,
    code: string,
    cresturl: string
});
exports.teamObj = mongoose.model('team', teamschema);

//module.exports = mongoose.model('team');