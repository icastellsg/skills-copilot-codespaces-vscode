// Create web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

//Ejemplo de comentario

// Create a web server with express
app.listen(3000, function(){
    console.log('Server is running on port 3000!');
});

// Set static file path
app.use(express.static('public'));

// Set body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// Set view engine
app.set('view engine', 'ejs');

// Connect to mongoDB with mongoose
var mongoose = require('mongoose');
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log('Connected to mongod server');
});
mongoose.connect('mongodb://localhost/mongodb_tutorial');

// Create schema
var CommentSchema = mongoose.Schema({
    name: String,
    password: String,
    comment: String,
    date: {type: Date, default: Date.now}
});

// Create model
var Comment = mongoose.model('comment', CommentSchema);

// Set routes
app.get('/comments', function(req, res){
    Comment.find({}, function(err, comments){
        if(err) return res.status(500).send({error: 'Database failure'});
        res.json(comments);
    });
});

app.post('/comments', function(req, res){
    var comment = new Comment();
    comment.name = req.body.name;
    comment.password = req.body.password;
    comment.comment = req.body.comment;

    comment.save(function(err){
        if(err){
            console.error(err);
            res.json({result: 0});
            return;
        }
        res.redirect('/');
    });
});

app.get('/comments/:comment_id', function(req, res){
    Comment.findOne({_id: req.params.comment_id}, function(err, comment){
        if(err) return res.status(500).json({error: err});
        if(!comment) return res.status(404).json({error: 'Comment not found'});
        res.json(comment);
    });
});

app.put('/comments/:comment_id', function(req, res){
    Comment.findById(req.params.comment_id, function(err, comment){
        if(err) return res.status(500).json({error: 'Database failure'});
        if(!comment) return res.status(404).json({error: 'Comment not found'});

        if(req.body.name) comment.name = req.body.name;
        if(req.body.password) comment.password = req.body.password;
    })});