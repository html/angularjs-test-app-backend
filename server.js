'use strict';

const express = require('express'), mongoose = require('mongoose'), bodyParser = require('body-parser');

const PORT = 8080;

// App
const app = express();
mongoose.connect('mongodb://localhost/jstest');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next){
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    return next();
});

app.get('/', function (req, res) {
  res.send('Test js app backend by Olexiy Zamkoviy\n');
});

function endResponseWithError(response, err){
    console.log('Error response', err);
    return response.end('{"error": "' + JSON.stringify(err) + '}');
}

function successResponse(response){
    console.log('Success response');
    response.end('{"status": "ok"}');
}

global.app = app;
global.mongoose = mongoose;
global.successResponse = successResponse;
global.endResponseWithError = endResponseWithError;

require('./projects');
require('./todos');

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);

