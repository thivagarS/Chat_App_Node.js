const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const {generateMessage, generateLocation} = require('./utils/message')
const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 8080;
const app = express();

// This was to setup socket io & app - is equal to the req n res callback parameter in the creareserver
var server = http.createServer(app);
var io = socketIO(server);

// TO serve the static files
app.use(express.static(publicPath));


// Event emitters
io.on('connection', (socket) => {
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app'));

    socket.broadcast.emit('newMessage',  generateMessage('Admin', 'New user connected'));
    
    socket.on('createMessage', (text, callback) => {
        // console.log(`New message recieved from client ${text}`);
        // io emit to the all client connect to the server
        io.emit('newMessage',  generateMessage(text.from, text.text));
        
        callback();
        // This will emit to all the tabs except the emitted tab
        // socket.broadcast.emit('newMessage', {
        //     from : text.from,
        //     text: text.text
        // });

    });

    socket.on('createLocation', (loc) => {
        io.emit('sendLocation', generateLocation(loc.from, loc.location))
    });

    socket.on('disconnect', () => {
        console.log(`Disconnected from the client`);
    });
});

// Server
server.listen(port, () => {
    console.log(`Application startd running on port ${port} ...`);
}); 