var mongoose = require('mongoose');

var uri = "mongodb://admin:rtvwc18@wc18-shard-00-00-xplty.mongodb.net:27017,wc18-shard-00-01-xplty.mongodb.net:27017,wc18-shard-00-02-xplty.mongodb.net:27017/test?ssl=true&replicaSet=WC18-shard-0&authSource=admin";

exports.connect = mongoose.connect(uri, { autoIndex: false }, function (err) {
    if (err) throw err;
    console.log('Successfully connected DB');

});