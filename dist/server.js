"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var metrics_1 = require("./metrics");
var bodyparser = require("body-parser");
var app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded());
var port = process.env.PORT || '8080';
app.get('/', function (req, res) {
    res.write('Hello world');
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
// app.post('/metrics/:id', (req: any, res: any) => {
//     dbMet.save(req.params.id, req.body)
//   })
app.listen(port, function (err) {
    if (err) {
        throw err;
    }
    console.log("server is listening on port " + port);
});
/*  "populate":"./node_modules/.bin/ts-node bin/populate.ts" ds packageconfig.json */
//Metric -> Delete route/metrics/:id
//Mocha + should
