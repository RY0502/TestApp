'use strict';
var express = require('express');
const http = require('http');
var serveStatic = require('serve-static');
var serveIndex = require('serve-index');
var bodyParser = require('body-parser');
var serviceLayer = require('./Service');
//var mongoDb = require('./Database');

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
    //var urls = serviceLayer.dbBuilderService.dataURLs(function (err, data) {
      //  var users = JSON.parse(data);
      //  console.log(users._links.teams.href);
       // serviceLayer.dbBuilderService.getTeamData(users._links.teams.href, function (err, data) {
            
        //})
        //res.send(data);
    //});
       serviceLayer.dbBuilderService.extractAndSaveData(req, res);
});
app.listen(3000);