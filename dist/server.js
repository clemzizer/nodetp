"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var metrics_1 = require("./metrics");
var bodyparser = require("body-parser");
var app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded());
var port = process.env.PORT || '8080';
var dbMet = new metrics_1.MetricsHandler('./db/metrics');
app.get('/', function (req, res) {
    res.setHeader('Content-Type', 'text/plain');
    //res.render('hello', { name: req.session.username })
    //res.write('Hello world')
    res.send('/hello takes a name query parameter like this: /hello/yourname, a random names replies hello [name], /hello/Clement (my own name) replies with a short intro of myself');
    res.end();
});
app.get('/metrics', function (req, res) {
    metrics_1.MetricsHandler.get(function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});
app.get('/metrics:id', function (req, res) {
    metrics_1.MetricsHandler.get(function (err, result) {
        if (err) {
            throw err;
        }
        if (result === undefined) {
            res.write('no result');
            res.send();
        }
        else
            res.json(result);
    });
});
app.post('/metrics/:id', function (req, res, next) {
    dbMet.save(req.params.id, req.body, function (err, result) {
        if (err) {
            res.status(500).send(err.message);
        }
        res.status(200).send();
    });
});
app.get('/hello/:name', function (req, res) {
    res.setHeader('Content-Type', 'text/plain');
    if (req.params.name === 'Clement')
        res.send('Hi! My name is Clement, I\'m a 5th year student at ECE Paris studying BigData & Analytics');
    else
        res.send('Hello ' + req.params.name);
});
app.use(function (req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Error 404. Message not found.');
});
app.listen(port, function (err) {
    if (err) {
        throw err;
    }
    console.log("server is listening on port " + port);
});
/*  "populate":"./node_modules/.bin/ts-node bin/populate.ts" ds packageconfig.json */
//Metric -> Delete route/metrics/:id
//Mocha + should
