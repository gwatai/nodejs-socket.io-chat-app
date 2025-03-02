const express = require('express');
const app = express();
const router = express.Router()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, 
    // maxHttpBufferSize = 10000,
    // pingTimeout = 60000,
);
const {storeChat, run} = require('../db')



app.use(express.static(__dirname));

//testing html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
    // res.send('<h1>Hello, World!</h1>');
});

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/chat.html');
    // res.send('<h1>Hello, World!</h1>');
});

//keep track of users
const connectedUsers = new Set();
//test connection
io.on('connection', (socket) => {

    console.log('User connected: ' + socket.id);
    socket.join('counselling-room')

    //cient 
    socket.on('client join', (msg) => {
        try{
            console.log('client socket id: ', socket.id);
        if(!connectedUsers.has(socket.id)){
            console.log(msg);
        socket.join('counselling-room')
        socket.userType = 'user';
        io.to('counselling-room').emit('client join', {
            message: 'client joined the chat',
            UserId: socket.id,
            sender: 'user'
        });
        }
        
    }catch(err){
        console.log('error in client join: ',err);
    }
    });

    //consellor

    socket.on('counsellor join', (msg) => {
        try{
            console.log('counsellor socket id: ', socket.id);
            if(!connectedUsers.has(socket.id)){
        console.log(msg);
        socket.join('counselling-room')
        socket.userType = 'counselor';
        connectedUsers.add(socket.id);
        io.to('counselling-room').emit('counsellor join', {
            message: 'consellor joined',
            counsellorId: socket,
            sender: 'counselor'
        });
    }
    }catch(err){
        console.log('error in consellor join: ',err);
    }
    });

    //chat 
    socket.on('chat message', (msg) => {
        try{
    if(socket.userType){
        console.log('chat message: ' + msg);
        try{        io.to('counselling-room').emit('chat message', {
            message: msg,
            sender: socket.userType,
            SenderId: socket.id
        });
        storeChat({
            user: socket.userType,
            message: msg
        })
    }catch(err)
    {
        console.log("chat error",err)
    }
    }
    }catch(err){
        console.log('error in chat message: ', err);
    }
    });


    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
        io.to('counselling-room').emit('user disconnected', {
            message: 'user disconnected',
            UserId: socket.id,
            UserType: socket.userType
        });
    });
});


const loadClientMessages = async (req, res) => {

    try{


    const {user} = req.body
    const messages =  await run()
    console.log("messages api res",messages)
    res.status(200).json(messages)
    }catch(err)
    {
        console.log("load messages error", err)
    }
}
app.use(express.json())
app.get('/api/user/chat', loadClientMessages)


console.log('Websocket Server is running on http://localhost:3000');

server.listen(3000);

