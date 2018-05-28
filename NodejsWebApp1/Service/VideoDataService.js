const GOOGLE_KEY = 'AIzaSyAToOlrIhYZdnghpKEMVxMQHyntDIyof6I';
const YOUTOUBE_URL = 'https://www.googleapis.com/youtube/v3/search';
const SEARCH_STRING = '?q=fifa%20world%20cup%202018&order=date&part=snippet&key=';
var utils = require('../Utils');
var httprequest = require('request');

exports.getVideoData = function (req, res) {

    const url = YOUTOUBE_URL + SEARCH_STRING + GOOGLE_KEY;

    httprequest(url, function (error, response, body) {
        if (error) {
            console.log('Error while getting video data from youtoube: ' + error);
            utils.setResponse.setFailureHeaders(res);
            res.send(utils.setResponse.failureObject);
        } else {
            if (response.statusCode == 200) {
                let respObject = {};
                var videoArr = [];
                const videoData = JSON.parse(body);
                if (videoData.items != undefined) {
                    const datalength = videoData.items.length;
                if (datalength != undefined && datalength > 0) {
                    for (let i = 0; i < datalength; i++) {
                        let videoObject = {};
                        videoObject.id = videoData.items[i].id.videoId;
                        videoObject.publishedAt = videoData.items[i].snippet.publishedAt;
                        videoObject.channelId = videoData.items[i].snippet.channelId;
                        videoObject.title = videoData.items[i].snippet.title;
                        videoObject.description = videoData.items[i].snippet.description;
                        videoArr.push(videoObject);
                    }
                }
                }
                respObject.status = "success";
                respObject.videos = videoArr;
                utils.setResponse.setSuccessHeaders(res);
                res.send(respObject);
            } else {
                console.log(response.statusCode);
                utils.setResponse.setFailureHeaders(res);
                res.send(utils.setResponse.failureObject);
            }
        }
    });
        }