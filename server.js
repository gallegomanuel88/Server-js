//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require("http")
var ws = require("nodejs-websocket")
var fs = require("fs")
var json = require('json');

http.createServer(function (req, res) {
	fs.createReadStream("index.html").pipe(res)
}).listen(process.env.PORT)

var server = ws.createServer(function (connection) {
	connection.nickname = null
	connection.on("text", function (str) {
		console.log(str)
		var objJSON = JSON.parse(str);
		if (connection.nickname === null) {
			connection.nickname = objJSON.id;
			var isIn = "{\"id\":\""+connection.nickname+"\", \"msg\":\" entrou no chat\"}"
			console.log(isIn)
			broadcast(isIn)
		} else
			broadcast(str)
	})
	connection.on("close", function () {
		broadcast("{id:"+connection.nickname+" left\"")
	})
})
server.listen(8081)

function broadcast(str) {
	server.connections.forEach(function (connection) {
		connection.sendText(str)
	})
}

console.log(process.env.PORT)
