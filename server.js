const { createServer } = require("node:http");
const next = require("next");
const { Server } = require("socket.io");
const ws = require("ws");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer);
    /*
        io.on("connection", (socket) => {
            console.log("connected");
            socket.on("room_message", (roomId) => {
                io.emit(`room_${roomId}`, "changed");
            });
        });
        */
    io.on("connect", (socket) => {
        socket.on("chat", (roomId, content, name) => {
            console.log(roomId, content, name);
            io.emit(`chat_${roomId}`, content, name);
        });
        socket.on("room_change", (roomId) => {
            console.log("changed: ", roomId);
            io.emit(`room_${roomId}`, "change");
        });
    });
    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});
