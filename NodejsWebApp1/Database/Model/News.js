var mongoose = require('mongoose');

var newsSchema = mongoose.Schema({
    author: String,
    title: String,
    description: String,
    url: String,
    urlToImage: String,
    imagename: String,
    img: Buffer,
    publishedAt: String
});

exports.newsModel = mongoose.model('News', newsSchema);