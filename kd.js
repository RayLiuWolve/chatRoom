/**
 * Created by ray_liu on 16/8/29.
 */



module.exports = function(client, socket){


    this.setSocketName = function(name){
        socket.name = name;
        //this.skt.emit('msg', "jajajajaja");
    }


    this.addChatter = function(name){
        client.sismember('chatters', name, function(err, reply) {
            if (err) throw err;
            if(!reply){
                console.log("not exists");
                client.sadd("chatters", name);

            }
            socket.broadcast.emit("userChange");

            client.smembers('chatters', function(err, names) {
                client.scard("chatters", function(err, reply){
                    if (err) throw err;
                    var totalUsers = reply;
                    names.forEach(function(name){
                        socket.emit('add one', {name: name, num: totalUsers});
                        socket.broadcast.emit("add one", {name: name, num: totalUsers});
                    });
                });

            });


            client.lrange("messages", 0, -1, function(err, messages){
                messages = messages.reverse();
                messages.forEach(function(msg){
                    msg = JSON.parse(msg);

                    socket.emit("msg",msg);
                });
            });
        });
    }


    this.rmName = function(){
        client.srem("chatters", socket.name);
        socket.broadcast.emit("userChange");

        client.smembers('chatters', function(err, names) {
            client.scard("chatters", function(err, reply){
                if (err) throw err;
                var totalUsers = reply;
                    names.forEach(function(name){
                    socket.emit('add one', {name: name, num: totalUsers});
                    socket.broadcast.emit("add one", {name: name, num: totalUsers});
                });
            });

        });


    }



    this.saveMsg = function(msg){
            client.lpush("messages", msg, function(err, response){
            client.ltrim("messages", 0, 19);
        });
    }




}
