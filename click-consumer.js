var amqp = require('amqp'),
    Db = require('mongodb').Db,
    Server = require('mongodb').Server;
    
var connection = amqp.createConnection();

connection.addListener('ready', function() {
    
    // Create a queue for click messages
    var queue = connection.queue('click-queue', {
        durable: true,
        autoDelete: false
    });
    
    // Ensure the exchange exists
    var exchange = connection.exchange('click-exchange', {
        type: 'direct',
        autoDelete: 'false'
    }, function () {
        // When the exchange is ready, bind the queue to it
        queue.bind('click-exchange', 'click');
    });
    
    new Db('nodensity', 
    
        new Server("127.0.0.1", 27017), {}).open(function(err, db) {
            
            // Open the click collection in MongoDB
            db.collection('clicks', function(err, collection) {

                // Listen for new click messages
                queue.subscribe(function (message) {

                    var record = {
                        x: message.message.x,
                        y: message.message.y
                    };

                    // Add a new record for the click
                    collection.insert(record, function(err, doc) {

                        console.log('Click recorded: x: ' + record.x + ', y: ' + record.y);

                    });
                });

            });

        }
    );

});