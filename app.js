/**
 * Created by ray_liu on 16/8/27.
 */
/**
 * Created by ray_liu on 16/8/25.
 */

var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);

var io = require('socket.io')(server);
var path = require('path');


app.use(express.static(path.join(__dirname, 'public')));

var redis = require('redis');
var redisClient = redis.createClient();
var dBase = require('./kd.js');


io.on('connection', function (socket) {

    var db = new dBase(redisClient, socket);

    socket.on('join', function(data){   //when a new chatter join in.
        socket.name = data;
        db.setSocketName(data);

        db.addChatter(data);
        console.log('user '+socket.name + ' join the chatroom!');


    });

    socket.on('msg', function(data){
        console.log(data.name + "  !!!");
        socket.emit('msg', data);
        socket.broadcast.emit("msg", data);

        var msg = JSON.stringify({name:data.name, speech:data.speech, time: data.time});

        db.saveMsg(msg);
    });

    socket.on('disconnect', function(){
       console.log("user "+ socket.name + " leave chatroom!");

        db.rmName();
    })
});


app.get('/', function(req, res){
    res.sendFile(__dirname+'/public/views/index.html');
});

server.listen(8080);