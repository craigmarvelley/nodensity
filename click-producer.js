var http = require('http'),
    url = require('url'),
    amqp = require('amqp');

// Create a new RabbitMQ Connection
var connection = amqp.createConnection();

connection.addListener('ready', function() {
    
    // Make sure the exchange exists
    var exchange = connection.exchange('click-exchange', {
        type: 'direct',
        autoDelete: 'false'
    });
    
    // Create a HTTP server to listen for clicks
    var server = http.createServer(function (request, response) {
        var params = url.parse(request.url, true).query;
        
        // Add a new message to the exchange
        exchange.publish('click', {message: params}, {
            mandatory: true
        });

        // Tell the browser that everything's ok'
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.end('');
        
    });
    
    var port = 1337,
        host = 'nodensity';
    
    server.listen(port, host);
    
    console.log("Click producer listening on port %d in %s mode", 1337, 'nodensity');

});