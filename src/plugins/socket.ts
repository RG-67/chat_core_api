import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import dotEnv from 'dotenv';


dotEnv.config();


let io: Server;

const onlineUsers = new Map<string, string>();


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
        const userId = socket.user.data.id;
        onlineUsers.set(userId, socket.id);
        console.log("User connected:", socket.user.data.id);

        socket.on("send_message", (data: any) => {
            const receiverId = onlineUsers.get(data.receiverId);

            if (receiverId) {
                io.to(receiverId).emit("receive_message", {
                    senderId: userId,
                    text: data.text
                });
            }
        });

        socket.on("disconnect", () => {
            onlineUsers.delete(userId);
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