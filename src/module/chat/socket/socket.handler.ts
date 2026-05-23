import { Server, Socket } from "socket.io";
import { SOCKET_EVENTS } from "./socket.events";
import { MessageService } from "../message/message.service";
import { MessageRepository } from "../message/message.repository";
import { pool } from "../../../config/db";
import redisClient from "../../../config/redis";


const messageRepo = new MessageRepository(pool);
const messageService = new MessageService(messageRepo);

const onlineUsers = new Map<string, string>();

export const registerHandler = async (io: Server, socket: Socket) => {
    const userId = (socket as any).user.data.id;

    const refreshPresence = async (userId: string) => {
        await redisClient.set(
            `user:${userId}`,
            "1",
            {
                EX: 30
            }
        );
    }



    onlineUsers.set(userId, socket.id);
    await refreshPresence(userId);

    io.emit(SOCKET_EVENTS.USER_ONLINE, {
        userId
    });

    console.log("User connected:", userId);


    socket.on(SOCKET_EVENTS.SEND_MESSAGE, async (data: any) => {
        if (typeof data === "string") {
            data = JSON.parse(data);
        }

        const receiverId = onlineUsers.get(data.receiverId);

        await refreshPresence(userId);

        const messageData = {
            senderId: userId as string,
            receiverId: data.receiverId as string,
            content: data.text as string
        }

        const result = await messageService.insertMessage(messageData);
        console.log(result.message);

        if (receiverId) {
            io.to(receiverId).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, {
                senderId: userId,
                text: data.text
            });
        }
    });

    socket.on(SOCKET_EVENTS.TYPING, async (data: any) => {
        if (typeof data === "string") {
            data = JSON.parse(data);
        }
        const receiverId = onlineUsers.get(data.receiverId);

        await refreshPresence(userId);

        if (receiverId) {
            io.to(receiverId).emit(SOCKET_EVENTS.USER_TYPING, {
                senderId: userId
            });
        }
    });

    socket.on(SOCKET_EVENTS.STOP_TYPING, async (data: any) => {
        if (typeof data === "string") {
            data = JSON.parse(data);
        }

        const receiverId = onlineUsers.get(data.receiverId);

        await refreshPresence(userId);

        if (receiverId) {
            io.to(receiverId).emit(SOCKET_EVENTS.STOP_TYPING, {
                senderId: userId
            });
        }
    });

    socket.on(SOCKET_EVENTS.DISCONNECT, async () => {
        await redisClient.del(`user:${userId}`);
        onlineUsers.delete(userId);

        io.emit(SOCKET_EVENTS.USER_OFFLINE, {
            userId
        });

        console.log("User disconnected: ", userId);
    });

}