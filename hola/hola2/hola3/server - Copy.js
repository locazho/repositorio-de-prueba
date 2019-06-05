var mysql = require('mysql');
var hapi = require('hapi');
var inert = require('inert');
var routes = require('./routes');
var auth = require('hapi-auth-cookie');
//var fs = require('fs');
//var https = require('https');
var io;

var server = new hapi.Server();
var SOCKETSESIONES={};
server.connection({
    host:'www.devsutils.com',
    port: 8989,
    routes: {cors:true}/*,
    tls: ssl*/
});


var config = {
  database: "bdhackcrea",
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  charset: 'UTF8_GENERAL_CI',
  connectTimeout:60000,
  connectionLimit: 15,
  queueLimit: 30,
  acquireTimeout: 1000000,
  pool: { maxConnections: 50, maxIdleTime: 30}
}

var connection = mysql.createConnection(config);

var pool  = mysql.createPool(config);
exports.connection=connection;
exports.pool=pool;
connection.connect(function(err) {
  if (err) {console.dir(err);}else{
    console.log("Conexion exitosa a la base de datos");
  };
});

server.register([inert, auth], function(err){
  server.route(routes.endpoints);
  io = require('socket.io')(server.listener);
  exports.io=io;
  io.on('connection', function (socket) {
  socket.on("register", function(data) {
    if(!SOCKETSESIONES[`X${data.I}`]){
        SOCKETSESIONES[`X${data.I}`] = [socket.id];
    }else{
      SOCKETSESIONES[`X${data.I}`].push(socket.id);
    }
  });
  });
	server.start(function () {
	    console.log('Corriendo Servidor Hack Crea:', server.info.uri);
	});
});
