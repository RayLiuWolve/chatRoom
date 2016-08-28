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
var totalUsers = 0;


app.use(express.static(path.join(__dirname, 'public')));


var redis = require('redis');
var redisClient = redis.createClient();


io.on('connection', function (socket) {

    console.log("one user connected!");

    socket.on('join', function(data){   //when a new chatter join in.
        socket.name = data;
        totalUsers++;

        redisClient.sadd("chatters", data);

        console.log('user '+socket.name + ' join the chatroom!');

        socket.broadcast.emit("userChange");
        showName(socket);

        redisClient.lrange("messages", 0, -1, function(err, messages){
            messages = messages.reverse();
            messages.forEach(function(msg){
               msg = JSON.parse(msg);
               //console.log("---------------" + msg.name + ":  " +msg.speech);
               socket.emit("msg",msg);
            });
        });
    });



    socket.on('msg', function(data){
        console.log(data.name + "  !!!");
        socket.emit('msg', data);
        socket.broadcast.emit("msg", data);

        var msg = JSON.stringify({name:data.name, speech:data.speech, time: data.time});

        redisClient.lpush("messages", msg, function(err, response){
            redisClient.ltrim("messages", 0, 19);
        });


    });

    socket.on('disconnect', function(){
       console.log("user "+ socket.name + " leave chatroom!");
       totalUsers--;

       redisClient.srem("chatters", socket.name);
       socket.broadcast.emit("userChange");

       showName(socket);
    })
});

function showName(socket) {
    redisClient.smembers('chatters', function(err, names) {
        names.forEach(function(name){
            socket.emit('add one', {name: name, num:totalUsers});
            socket.broadcast.emit("add one", {name: name, num:totalUsers});
        });
    });

}



app.get('/', function(req, res){
    res.sendFile(__dirname+'/public/views/index.html');
});

server.listen(8080);