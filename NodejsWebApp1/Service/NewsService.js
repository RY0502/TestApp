const NewsAPI = require('newsapi');
const constantsutil = require('../Utils/constants');
const newsapi = new NewsAPI(constantsutil.NEWS_API_KEY);
var Q = require('q');
var newsDb = require('../Database');
var httprequest = require('request');
const sharp = require('sharp');
const async = require('async');
const filesystem = require('fs');
var utils = require('../Utils');

exports.getnewsFromExternalSource = function (globalvar) {

    var deferred = Q.defer();
    //try {
        newsapi.v2.everything({
            q: "'world cup'",
            sources: 'bbc-sport',
            language: 'en',
            sortBy: 'publishedAt'
        }).then(response => {
            var articles = response.articles;
            const totalarticles = articles.length;
            let news = {};
            let i = 0;
            while (i < totalarticles) {

                let currentarticle = articles[i];
                if (currentarticle.url.includes(constantsutil.NEWS_PARSE_KEYWORD)) {
                    news[currentarticle.publishedAt] = currentarticle;
                }
                if (Object.keys(news).length == constantsutil.NEWS_TO_BE_DISPLAYED) {
                    break;
                }
                i++;

            }
            updateNewsDelta(news, globalvar);
            }).catch (function (reason) {
                console.log('News fetch failed from external source:', reason);
            });
    /*} catch (ex) {
        console.log('News fetch failed from external source:', ex);
    }*/
}

exports.initialisenews = function () {

    var deferred = Q.defer();

    var newsGetPromise = newsDb.getNews.getAllNewsFromDb();

    newsGetPromise.then(function (data) {
        let newsmap = {};
        if (data != undefined && data.length > 0) {
            var datalen = data.length;
            for (let i = 0; i < datalen; i++) {
                filesystem.writeFile(global.staticcontent + data[i].imagename, data[i].img, 'binary', function (err) {
                    if (err) {
                        console.log('Error writing image during initialization: ' + err);
                    } else {
                        data[i].img = null;
                        newsmap[data[i].publishedAt] = data[i];
                    }
                    datalen--;
                    if (datalen == 0) {
                        deferred.resolve(newsmap);
                    }
                });

            }
        } else {
            deferred.resolve(newsmap);
        }
    }).catch(function (reason) {
        console.log('News fetch failed with:', reason);
        deferred.reject(new Error(reason));
        });
    return deferred.promise;
}

function updateNewsDelta(sourcenews, globalvar) {

    var failedimages = {};
    var sourcesize = Object.keys(sourcenews).length;
    if (sourcesize > 0) {
        if (Object.keys(globalvar.newsmap).length > 0) {
            for (keysource in sourcenews) {
                let keyexists = checkkeyglobalnews(keysource, globalvar);
                if (keyexists == false) {
                    let newsobject = sourcenews[keysource];
                    let urlofnews = newsobject.urlToImage;
                    if (urlofnews != '' && urlofnews != ' ') {
                        let url = urlofnews.split('/');
                        newsobject.imagename = url[(url.length - 1)];
                    }
                    globalvar.newsinsertmap[keysource] = newsobject;
                    globalvar.newsmap[keysource] = newsobject;
                }
            }

            let currlength = Object.keys(globalvar.newsmap).length;
            if (currlength > constantsutil.NEWS_TO_BE_DISPLAYED) {
                var times = Object.keys(globalvar.newsmap);
                times.sort();
                for (let i = 0; i < (currlength - constantsutil.NEWS_TO_BE_DISPLAYED); i++) {
                    globalvar.newsdeletemap[times[i]] = sourcenews[times[i]];
                }
            }

        } else {
            for (key in sourcenews) {
                let newsobject = sourcenews[key];
                let urlofnews = newsobject.urlToImage;
                if (urlofnews != '' && urlofnews != ' ') {
                    let url = urlofnews.split('/');
                    newsobject.imagename = url[(url.length - 1)];
                }
                globalvar.newsinsertmap[key] = newsobject;
                globalvar.newsmap[key] = newsobject;
            }
        }
        async.forEachOf(globalvar.newsinsertmap, function (value, key, callback) {
            downloadimages(
                value, key, failedimages, globalvar, callback)
        }, function (err) {
            let failedimageskeys = Object.keys(failedimages);
            if (failedimageskeys != undefined) {
                for (let i = 0; i < failedimageskeys.length; i++) {
                    delete globalvar.newsinsertmap[failedimageskeys[i]];
                    delete globalvar.newsmap[failedimageskeys[i]];
            }
            }
            updatenewstodb(globalvar);
        });
    }
}


function updatenewstodb(globalvar) {
    if (Object.keys(globalvar.newsinsertmap).length > 0) {
        var newsinsertarr = [];
        for (key in globalvar.newsinsertmap) {
            if (globalvar.newsinsertmap.hasOwnProperty(key)) {
                newsinsertarr.push(globalvar.newsinsertmap[key]);
            }
        }
        newsDb.getNews.saveNewsToDB(newsinsertarr, globalvar, deletenews);
    } else {
        deletenews(globalvar);
    }
}

function deletenews(globalvar) {

    let delkeys = Object.keys(globalvar.newsdeletemap);
    var delkeyslen = delkeys.length;
    if (delkeyslen > 0) {
        newsDb.getNews.deleteNewsFromDB(delkeys, globalvar, function () {
            for (let i = 0; i < delkeys.length; i++) {
                let imagetodelete = globalvar.newsmap[delkeys[i]].imagename;
                filesystem.unlink(globalvar.imagedir + imagetodelete, function (err) {
                    if (err) {
                        console.log('Error while deleting image: ' + imagetodelete);
                    } else {
                        delete globalvar.newsdeletemap[delkeys[i]];
                        delete globalvar.newsmap[delkeys[i]];
                        console.log('Successfully deleted image: ' + imagetodelete);
                    }
                    delkeyslen--;
                    if (delkeyslen == 0) {
                        console.log("Delete map size after key removal: " + Object.keys(globalvar.newsdeletemap).length);
                        console.log('Scheduler completed');
                    }
                });
            }
        });
    } else {
        console.log('Scheduler completed');
    }

}

function checkkeyglobalnews(keytocheck, globalvar) {
    for (key in globalvar.newsmap) {
        if (key == keytocheck) {
            return true;
        }
    }
    return false;
}

function downloadimages(newsobject, key, failedimages, globalvar, callback) {
    try {

        let urlimage = newsobject.urlToImage;
        if (urlimage != undefined && urlimage != '' && urlimage != ' ' && urlimage != null) {
            var transformer = sharp()
                .resize(825,500)
                .on('info', function (info) {
                    console.log('Image height is ' + info.height);
                }).toFile(globalvar.imagedir+newsobject.imagename, function (error, info, sucessimages) {
                    if (error) {
                        console.log('Error while resizing ' + newsobject.imagename + '\n' + error);
                        failedimages[key] = "error";
                        callback();
                    } else {
                        filesystem.readFile(globalvar.imagedir + newsobject.imagename, function (error, data) {
                            if (error) {
                                console.log('Error while reading downloaded image: ' + error);
                            } else {
                                newsobject.img = data;
                            }
                            callback();
                        });
                    }
                });

            httprequest(urlimage, function (error, response, body) {
                if (error) {
                    console.log('Error while downloading: ' + urlimage, error);
                    failedimages[key] = "error";
                    callback();
                }
            }).pipe(transformer);
        }
    } catch (error) {
        failedimages[key] = "error";
        callback();
    }
}

function imagedownloadcallback(error, results) {

    if (error) {
        console.log('Error received for key ' + key);
    }
}

exports.getNews = function (req, res) {

    var newsGetPromise = newsDb.getNews.getNewsFromDb();

    newsGetPromise.then(function (data) {
        if (data != undefined && data.length > 0) {
            var datalen = data.length;
            for (let i = 0; i < datalen; i++) {
                let imageurl = data[i].imagename;
                if (imageurl != undefined && imageurl != '') {
                    imageurl =  imageurl;
                } else {
                    imageurl =  'default.jpg';
                }
                data[i].urlToImage = imageurl;
            }
            utils.setResponse.setSuccessHeaders(res);
            res.send(data);
        } else {
            utils.setResponse.setFailureHeaders(res);
            res.send(utils.setResponse.failureObject);
        }
    }).catch(function (reason) {
        console.log('News fetch failed with:', reason);
        deferred.reject(new Error(reason));
    });
}