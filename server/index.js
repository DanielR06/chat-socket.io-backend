import express  from "express";
import morgan from "morgan";
import { Server as SocketServer} from "socket.io";
import http from 'http'
import cors from "cors";

import { ORIGIN, PORT } from "./config.js";

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
    cors: {
        origin: "*"
    }
});

app.use(cors);
app.use(morgan('dev'));

io.on('connection', (socket) =>{
    console.log(socket.id);
    console.log('A user connected');
    const count = io.engine.clientsCount;
    console.log(count)
    socket.on('message', (message) => {
        socket.broadcast.emit('message', {
            body:message,
            from:socket.id
        });
    });
    socket.on('disconnect', () => {
        console.log('A user disconnected');

        console.log(io.engine.clientsCount); // Eliminar usuario desconectado

        // Actualizar la lista de usuarios conectados en el cliente
        //io.emit('users', Array.from(connectedUsers.keys()));
    });
});

server.listen(PORT);
console.log(`Server is running on port ${PORT}`);