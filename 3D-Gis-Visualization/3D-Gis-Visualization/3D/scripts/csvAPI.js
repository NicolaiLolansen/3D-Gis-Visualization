config: {
        port: 1337
}


var http = require("http");

http.createServer(function (request, response) {

    // Send the HTTP header 
    // HTTP Status: 200 : OK
    // Content Type: json
    response.writeHead(200, { 'Content-Type': 'application/json' });
    // Send the response body as "Hello World"
    response.end(config);
}).listen(config.port);