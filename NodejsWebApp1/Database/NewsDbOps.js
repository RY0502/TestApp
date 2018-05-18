var dbModels = require('./Model');
var Q = require('q');

exports.getAllNewsFromDb = function () {
    var deferred = Q.defer();
    dbModels.dbNewsModel.newsModel.find(function (err, news) {
        if (err) {
            deferred.reject(new Error(err));
        }
        deferred.resolve(news);
    });

    return deferred.promise;
}

exports.getNewsFromDb = function () {
    var deferred = Q.defer();
    dbModels.dbNewsModel.newsModel.find({})
        .select({
            "author": 1, "description": 1, "url": 1, "urlToImage": 1, "publishedAt": 1, "_id": 0 })
        .sort({ publishedAt: 'descending' })
        .limit(5)
        .exec(function (err, news) {
            if (err) {
                deferred.reject(new Error(err));
            }
            deferred.resolve(news);
        });

    return deferred.promise;
}

exports.saveNewsToDB = function (newsData, globalvar, callback) {
    var newsArr = [];
    for (var i = 0; i < newsData.length; i++) {
        var news = newsData[i];
        newsArr.push({
            author: news.author,
            title: news.title,
            description: news.description,
            url: news.url,
            urlToImage: news.urlToImage,
            imagename: news.imagename,
            img: news.img,
            publishedAt: news.publishedAt
        });
    }

    dbModels.dbNewsModel.newsModel.insertMany(newsArr,
            function (err, news) {
                if (err) {
                    console.log("There was a problem in adding news information to the database: " + err);
                    console.log("Scheduler completed with errors.");
                } else {
                    for (let i = 0; i < news.length; i++) {
                        globalvar.newsmap[news[i].publishedAt] = news[i];
                        delete globalvar.newsinsertmap[news[i].publishedAt];
                    }
                    console.log("Insert map size after key removal: " + Object.keys(globalvar.newsinsertmap).length);
                    callback(globalvar);
                }
            });
}

exports.deleteNewsFromDB = function (newsData, globalvar, cleardeletionmap) {
    dbModels.dbNewsModel.newsModel.deleteMany({publishedAt: { $in: newsData } }, function (err) {
        if (err) {
            console.log("There was a problem in deleting news information from the database: " + err);
            return;
        }
        cleardeletionmap();
    });
}