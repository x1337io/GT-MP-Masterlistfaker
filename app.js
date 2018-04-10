const request = require('request');
const net = require('net');
const dgram = require( "dgram" );

var i = 1;
var port = 4499;
        
console.log("Launching #" + i + " Port: " + port);
var options = {
  uri: 'http://master.mta-v.net/api/servers/addserver',
  method: 'POST',
  headers: { "Connection": "keep-alive", "Expect": "100-continue" },
  json: true,
  body: {
    "Port": port,
    "MaxPlayers": 1,
    "ServerName": "Testserver #" + i,
    "CurrentPlayers": 20,
    "Gamemode": "gameplate",
    "Map": "San Andreas",
    "Passworded": true,
    "fqdn": "",
    "LocalAddress": "0.0.0.0",
    "ServerVersion": "1.3.3.7"
  }
};

request(options, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log("Answered master! #" + i);
  }
});

setInterval(function() {
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("Answered master! #" + i);
      }
    });
}, 2 * 60 * 1000);

var socket = dgram.createSocket( "udp4" );

socket.on("message", function ( message, requestInfo ) {
    
    var response = new Buffer("890000e00107370000000a25707070706c65204772616e64205468656674204d756c7469706c617965722053657276657210fa0128ff22320866726565726f616d", "hex");

    socket.send(response, 0, response.length, requestInfo.port, requestInfo.address, function( error, byteLength ) { 
        console.log("Sent response for validation to " + requestInfo.address + ":" + requestInfo.port);
    }); 
});

socket.on("error", function ( error ) { 
    socket.close(); 
});

socket.on("listening", function () { 
    var address = socket.address(); 
    console.log( "socket listening " + address.address + ":" + address.port ); 
});

socket.bind(port, "0.0.0.0");
