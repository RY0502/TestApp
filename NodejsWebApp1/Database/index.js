//File for common export declarations for DB layer files
var mongoose = require('mongoose');

//var uri = "mongodb://admin:rtvwc18@wc18-shard-00-00-xplty.mongodb.net:27017,wc18-shard-00-01-xplty.mongodb.net:27017,wc18-shard-00-02-xplty.mongodb.net:27017/test?ssl=true&replicaSet=WC18-shard-0&authSource=admin";
var uri = "mongodb://mongoadmin:mongoadmin@datacluster-shard-00-00-kspci.mongodb.net:27017,datacluster-shard-00-01-kspci.mongodb.net:27017,datacluster-shard-00-02-kspci.mongodb.net:27017/footydb?ssl=true&replicaSet=DataCluster-shard-0&authSource=admin";
mongoose.connect(uri, { autoIndex: false }, function (err) {
    if (err) throw err;
    console.log('Successfully connected');
});
exports.dbBuilderOps = require('./DbBuilder');
exports.getFixtures = require('./FixtureDbOps');
exports.getTeams = require('./TeamDbOps');
exports.getPlayers = require('./PlayerDbOps');