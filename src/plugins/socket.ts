import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import dotEnv from 'dotenv';


dotEnv.config();


let io: Server;


export const initSocket = (server: any) => {

    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        },
    });

    io.use((socket: any, next) => {
        try {
            const token = socket.handshake.headers?.authorization?.split(" ")[1];
            if (!token) {
                return next(new Error("Unauthorized"));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET!);

            socket.user = decoded;
            next();
        } catch (error: any) {
            next(new Error(error.message));
        }
    });


    io.on("connection", (socket: any) => {
        console.log("User connected:", socket.user.data.id);

        socket.on("message", (data: any) => {

            /* socket.emit("message_received", {
                text: data.text,
            }); */

            io.emit("message_received", {
                id: socket.user.data.id,
                text: data,
            });
        });

        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });

};


export const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};