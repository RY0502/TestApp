'use strict';
var express = require('express');
const http = require('http');
var serveStatic = require('serve-static');
var serveIndex = require('serve-index');
var bodyParser = require('body-parser');
var serviceLayer = require('./Service');
var env = require('./resources/properties');
var crontab = require('node-crontab');
global.staticcontent = __dirname + '/static_content/';

var app = express()
    .use(express.static(staticcontent, { 'index': [/*'HTMLPage1.html',*/ 'index.htm'] }))
//.use(serveIndex(__dirname + '/static_content'))
    app.all('/', function (req, res, next) {
        res.write('all\n');
        next();
    })
    app.get('/', function (req, res, next) {
        res.end('get');
    })
    app.get('/getfixtures', function (req, res, next) {
        serviceLayer.getFixtureService.getFixtures(req, res);
    })
    app.get('/getteams', function (req, res, next) {
        serviceLayer.getTeamService.getTeams(req, res);
    })
    app.get('/getplayers', function (req, res, next) {
        serviceLayer.getPlayerService.getPlayers(req, res);
    })
    app.get('/getnews', function (req, res, next) {
        serviceLayer.getNewsService.getNews(req, res);
    })
    app.get('/gettrendingvideos', function (req, res, next) {
    serviceLayer.getVideoDataService.getVideoData(req, res);
    })
    app.put('/', function (req, res, next) {
        res.end('put');
    })
    app.post('/', function (req, res, next) {
        res.end('post');
    })
    app.delete('/', function (req, res, next) {
        res.end('delete');
    })
    app.get('/buildDB', function (req, res, next) {
       serviceLayer.dbBuilderService.extractAndSaveData(req, res);
});



var newspromise = serviceLayer.getNewsService.initialisenews(staticcontent);
newspromise.then(function (data) {
    var newsvarmap = new Object();
    newsvarmap.newsmap = data;
    newsvarmap.newsinsertmap = {};
    newsvarmap.newsdeletemap = {};
    newsvarmap.imagedir = staticcontent;
    crontab.scheduleJob('1-59 * * * *', function () {
        console.log('Scheduler started');
        var globalvar = this;
        serviceLayer.getNewsService.getnewsFromExternalSource(globalvar);
    }, null, newsvarmap);
    app.listen(env.runport);

}).catch(function (reason) {
    throw new Error(reason);
    });