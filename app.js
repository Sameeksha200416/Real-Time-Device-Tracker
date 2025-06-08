const express = require("express");
const app = express();
const path = require("path");//to use path module
const http = require("http");//http run on socket.io

const socketio = require("socket.io");

//so we create http server
const server = http.createServer(app);


const io = socketio(server);//socketio server

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")));

// io.on("connection",function (socket){
//     socket.on("send-location", function(data){
//         io.emit("receive-location", {id: socket.id, ...data});
//     });
//     socket.on("disconnect",function(){
//         io.emit("user-disconnected",socket.id);
//     })
// });

const users = {}; // Stores all users' locations

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("send-location", (data) => {
        console.log("User location:", socket.id, data); // Log the user's location
        console.log("current users:", users); // Log current users' locations
        users[socket.id] = data; // Save this user's location
        io.emit("receive-locations", users); // Send all users' locations to everyone
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        delete users[socket.id]; // Remove user on disconnect
        io.emit("receive-locations", users); // Update client with new list
    });
});



app.get("/",function(req,res){
    res.render("index");
});

server.listen(3000);