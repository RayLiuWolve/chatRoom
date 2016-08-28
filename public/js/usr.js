/**
 * Created by ray_liu on 16/8/25.
 */

var socket = io.connect('http://localhost:8080');


bootbox.prompt({
    title: "What is your name?",
    callback: function(name) {
        socket.name = name;
        if(name!=""){
            socket.emit('join', name);
        }
    }
});


socket.on("userChange",function(){   // clear the ul tag, ready to update names;
    document.getElementById("nameList").innerHTML ="";
});

socket.on("add one", function(name){   // add one name a time
    updateName(name);
});


socket.on('msg', function(data){
    addMsg(data);
});

function updateName(data){   // append li tag under ul tag
    var namePlace = document.createElement("li");
    namePlace.className = "list-group-item";
    var nameVal = document.createTextNode(data.name);
    namePlace.appendChild(nameVal);
    document.getElementById("nameList").appendChild(namePlace);  // a name is added
    document.getElementById("bg").innerHTML = data.num;  // name count is updated
}

function sendMessage(){
    var msg = document.getElementById("msgBox").value;
    document.getElementById("msgBox").value = "";
    var name = socket.name;
    var date = new Date();
    socket.emit('msg', {name:name, speech:msg, time: date.toUTCString()});

}



function addMsg(msg) {

    var liPlace = document.createElement("li");


    if(msg.name == socket.name) {
        liPlace.className = "right";
    }else{
        liPlace.className = "left";
    }

    var divPlace1 = document.createElement("div");
    if(msg.name == socket.name) {
        divPlace1.className = "media-body pad-hor speech-right";
    }else{
        divPlace1.className = "media-body pad-hor speech-left";
    }
    var divPlace2 = document.createElement("div");
    divPlace2.className = "speech";

    var pName = document.createElement("p");
    var pStrong = document.createElement("strong");
    var pSpeech = document.createElement("p");

    var timePlace = document.createElement("p");
    timePlace.className="speech-time";


    var nameVal = document.createTextNode(msg.name);
    var msgVal = document.createTextNode(msg.speech);
    var msgTime = document.createTextNode(msg.time);


    pStrong.appendChild(nameVal);
    pSpeech.appendChild(msgVal);
    pName.appendChild(pStrong);
    timePlace.appendChild(msgTime);


    divPlace2.appendChild(pName);
    divPlace2.appendChild(pSpeech);
    divPlace2.appendChild(timePlace);
    divPlace1.appendChild(divPlace2);
    liPlace.appendChild(divPlace1);

    document.getElementById("ulToAdd").appendChild(liPlace);


    var elem = document.getElementById('chatRoom');
    elem.scrollTop = elem.scrollHeight;
}
