var TodoItem = mongoose.model('TodoItem', { name: String, content: String, projectId: mongoose.Schema.Types.ObjectId });

app.post('/add-todo-item', function(req, res){
    if(!req.body.name){
        return endResponseWithError(res, 'No name provided');
    }

    var projectId = req.body.projectId ? req.body.projectId : null;
    var todoItem = new TodoItem({ name: req.body.name, projectId: projectId});

    todoItem.save(function(err){
        if(err){
            endResponseWithError(res, 'error: ' + err);
        }
    });

    successResponse(res);
});

app.post('/edit-todo-item', function(req, res){
    if(!req.body.name){
        return endResponseWithError(res, 'No name provided');
    }

    if(!req.body._id){
        return endResponseWithError(res, 'No todo item id provided');
    }

    TodoItem.findById(req.body._id, function(err, found){
       found.name = req.body.name;
       found.projectId = req.body.projectId ? req.body.projectId : null;

       found.save(function(err){
           if(err){
               endResponseWithError(res, 'error');
           }else{
               successResponse(res);
           }
       });
    });
});

app.get('/list-todo-items', function(req, res){
    TodoItem.find(function(err, todoItems){
        res.send(JSON.stringify(todoItems));
    });
});

app.post('/delete-todo-item', function(req, res){
    if(!req.body.id){
        return endResponseWithError(res, 'No id provided');
    }

    TodoItem.findByIdAndRemove(req.body.id, function(err, found){
        if(err){
            return endResponseWithError(res, 'Error');
        }

        successResponse(res);
    });
});

