const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    maxHttpBufferSize: 1e8
});

app.use(express.static("public"));

let messages = [];

io.on("connection", (socket) => {

    socket.emit("load messages", messages);

    socket.on("chat message", (data) => {

        let msg = {
            id: Date.now(),
            name: data.name,
            text: data.text || "",
            image: data.image || "",
            time: Date.now()
        };

        messages.push(msg);

        io.emit("chat message", msg);

        setTimeout(() => {
            messages = messages.filter(m => m.id !== msg.id);
            io.emit("delete message", msg.id);
        }, 60000);

    });

});

server.listen(3000, () => {
    console.log("Server running on 3000");
});