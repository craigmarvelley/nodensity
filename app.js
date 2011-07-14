var express = require('express'),
    mongo = require('mongodb');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

// Routes

app.get('/', function(req, res){

    // Get all clicks from database
    getClicks(function (clicks) {
        
        // Render the index template, passing in the clicks
        res.render('index', {
            clicks: clicks
        });
        
    });
    
});

// Get all clicks from the database

function getClicks(callback) {
    
    new mongo.Db('nodensity', 
    
        new mongo.Server("127.0.0.1", 27017), {}).open(function(err, db) {
            
            // Open the clicks collection
            db.collection('clicks', function(err, collection) {
                
                // Get all clicks as an array
                collection.find().toArray(function(err, clicks) {

                    // Send the clicks back
                    callback.apply(this, [clicks]);

                });
                
            });

        }
    );
        
}

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
