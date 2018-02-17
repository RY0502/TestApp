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
    app.route('/')
    .all(function (req, res, next) {
        res.write('all\n');
        next();
    })
    .get(function (req, res, next) {
        res.end('get');
    })
    .put(function (req, res, next) {
        res.end('put');
    })
    .post(function (req, res, next) {
        res.end('post');
    })
    .delete(function (req, res, next) {
        res.end('delete');
    });

    app.use('/buildDB', function (req, res, next) {
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