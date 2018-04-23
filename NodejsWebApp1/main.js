'use strict';
var express = require('express');
const http = require('http');
var serveStatic = require('serve-static');
var serveIndex = require('serve-index');
var bodyParser = require('body-parser');
var serviceLayer = require('./Service');
var env = require('./resources/properties');

var app = express()
    .use(express.static(__dirname + '/static_content', { 'index': [/*'HTMLPage1.html',*/ 'index.htm'] }))
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
app.listen(env.runport);