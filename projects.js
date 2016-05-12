var Project = mongoose.model('Project', { name: String });

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

