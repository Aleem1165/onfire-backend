import app from "./app";
import { Request, Response } from "express"
import { port } from "./config/env";
import { createServer } from "http";
import { Server } from "socket.io";
import { getLocalIp } from "./utils/getLocalIp";
import { connectDB } from "./config/db";

const httpServer = createServer(app)
const ip = getLocalIp()
connectDB()

const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
})

app.set("socketio", io);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, Onfire server!')
})

io.on(" ", (socket) => {
    console.log('Client connected')
    
    socket.on("disconnect", () => {
        console.log('Client disconnected');

    })
})

httpServer.listen(port, () => {
    console.log(`Server started on ${ip}:${port}`);
})