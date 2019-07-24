const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const {generateMessage, generateLocation} = require('./utils/message')
const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 8080;
const app = express();
const hbs = require('hbs');
const {User} = require('./utils/user');
var server = http.createServer(app);
var io = socketIO(server);
const {isRealString} = require('./utils/validator')
var users = new User;
// TO serve the static files
app.use(express.static(publicPath));

app.get('/getUserList', (req, res) => {
    res.send(users.getRoomList());
})
io.on('connection', (socket) => {
    socket.on('joinUser', (user, callback) => {
        
        if(!isRealString(user.name) || !isRealString(user.room))
            return callback("User Name and Room Name should be correct")
        user.room = user.room.toLowerCase()
        user.name = user.name.toLowerCase()
        if(users.getUserByName(user.name))
            return callback("User Name is already taken... Try with different name")
        console.log(`User ${user.name} joined ${user.room}`)
        socket.join(user.room)
        users.removeUser(socket.id);
        users.addUser(socket.id, user.name, user.room)
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app'));
        io.to(user.room).emit('updateList', users.getUserList(user.room));
        socket.broadcast.to(user.room).emit('newMessage',  generateMessage('Admin', `${user.name} connected`));
        
        socket.on('createMessage', (text, callback) => {
            // console.log(`New message recieved from client ${text}`);
            // io emit to the all client connect to the server
            io.to(user.room).emit('newMessage',  generateMessage(user.name, text.text));
            
            callback();
            // This will emit to all the tabs except the emitted tab
            // socket.broadcast.emit('newMessage', {
            //     from : text.from,
            //     text: text.text
            // });

        });

        socket.on('createLocation', (loc) => {
            io.to(user.room).emit('sendLocation', generateLocation(loc.from, loc.location))
        });

        socket.on('disconnect', () => {
            socket.leave(user.room);
            const removedUser = users.removeUser(socket.id)[0];
            console.log(removedUser);
            io.to(user.room).emit('updateList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage',  generateMessage('Admin', `${removedUser.name} left`));
            console.log(`Disconnected from the client`);
        });
    })
});

// Server
server.listen(port, () => {
    console.log(`Application startd running on port ${port} ...`);
}); 