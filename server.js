'use strict';

const express = require('express'), mongoose = require('mongoose'), bodyParser = require('body-parser');

const PORT = 8080;

// App
const app = express();
mongoose.connect('mongodb://localhost/jstest');
var Project = mongoose.model('Project', { name: String });

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
    return response.end('{"error": "' + JSON.stringify(err) + '}');
}

function successResponse(response){
    response.end('{"status": "ok"}');
}

app.post('/add-project', function(req, res){
    if(!req.body.name){
        return endResponseWithError(res, 'No name provided');
    }

    var project = new Project({ name: req.body.name});

    project.save(function(err){
        if(err){
            endResponseWithError(res, 'error');
        }
    });

    successResponse(res);
});

app.post('/edit-project', function(req, res){
    if(!req.body.name){
        return endResponseWithError(res, 'No name provided');
    }

    if(!req.body.id){
        return endResponseWithError(res, 'No project id provided');
    }

    Project.findById(req.body.id, function(err, found){
       found.name = req.body.name;
       found.save(function(err){
           if(err){
               endResponseWithError(res, 'error');
           }else{
               successResponse(res);
           }
       });
    });
});

app.get('/list-projects', function(req, res){
    Project.find(function(err, projects){
        res.send(JSON.stringify(projects));
    });
});

app.post('/delete-project', function(req, res){
    if(!req.body.id){
        return endResponseWithError(res, 'No id provided');
    }

    Project.findByIdAndRemove(req.body.id, function(err, found){
        if(err){
            return endResponseWithError(res, 'Error');
        }

        successResponse(res);
    });
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);

