'use strict';
var express = require('express');
const http = require('http');
var serveStatic = require('serve-static');
var serveIndex = require('serve-index');
var serviceLayer = require('./Service');

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
        var urls = serviceLayer.dbBuilderService.dataURLs(function (data) {
                res.end(data);
        });
    });
    app.listen(3000);