import { Server, Socket } from "socket.io";
import { SOCKET_EVENTS } from "./socket.events";
import { MessageService } from "../message/message.service";
import { MessageRepository } from "../message/message.repository";
import { pool } from "../../../config/db";
import redisClient from "../../../config/redis";
import { queue } from "../queue/message.queue";
import { onlineUsers } from "../presence/presence.service";



const messageRepo = new MessageRepository(pool);
const messageService = new MessageService(messageRepo);


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

    const presenceInterval = setInterval(() => {
        refreshPresence(userId).catch(console.error);
    }, 15000);

    if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
    }


    onlineUsers.get(userId)?.add(socket.id);
    await refreshPresence(userId);

    io.emit(SOCKET_EVENTS.ONLINE_USERS, Array.from(onlineUsers.keys()));

    console.log("User connected:", userId);


    socket.on(SOCKET_EVENTS.SEND_MESSAGE, async (data: any) => {
        try {
            if (typeof data === "string") {
                data = JSON.parse(data);
            }


            await refreshPresence(userId);


            /* const messageData = {
                senderId: userId as string,
                receiverId: data.receiverId as string,
                content: data.text as string
            } */

            /* const result: any = await messageService.insertMessage(messageData);
            console.log(result.message); */

            await queue.add("send-message", {
                senderId: userId,
                receiverId: data.receiverId,
                content: data.text
            });

            console.log("Message queued");


            /* socket.emit(SOCKET_EVENTS.MESSAGE_SENT, {
                messageId: result.data.id,
                receiverId: data.receiverId,
                text: data.text
            }); */

            // const receiverSockets = onlineUsers.get(data.receiverId);

            /* if (receiverSockets?.size) {
                receiverSockets.forEach((socketId) => {
                    io.to(socketId).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, {
                        messageId: result.data.id,
                        senderId: userId,
                        text: data.text
                    });
                });
            } */
        } catch (error) {
            console.log("SEND_MSG_SECTION: ", error);
        }

    });

    socket.on(SOCKET_EVENTS.MESSAGE_DELIVERED, async (data: any) => {
        try {
            if (typeof data === "string") {
                data = JSON.parse(data);
            }

            const senderSockets = onlineUsers.get(data.senderId);

            const delMsgData = {
                messageId: data.messageId,
                userId: userId
            }


            const delMsgResult = await messageService.deliveredMessageStatus(delMsgData);
            console.log(delMsgResult.message);


            if (senderSockets?.size) {
                senderSockets?.forEach((socketId) => {
                    io.to(socketId).emit(SOCKET_EVENTS.MESSAGE_DELIVERED, {
                        messageId: data.messageId
                    });

                });
            }
        } catch (error) {
            console.log("MSG_DEL: ", error);
        }
    });

    socket.on(SOCKET_EVENTS.MESSAGE_SEEN, async (data: any) => {
        try {
            if (typeof data === "string") {
                data = JSON.parse(data);
            }

            const seenMsgData = {
                messageId: data.messageId,
                userId: userId
            }

            const result = await messageService.seenMessageStatus(seenMsgData);
            console.log(result.message);

            const senderSockets = onlineUsers.get(data.senderId);

            if (senderSockets?.size) {
                senderSockets?.forEach((socketId) => {
                    io.to(socketId).emit(SOCKET_EVENTS.MESSAGE_SEEN, {
                        messageId: data.messageId
                    });
                });
            }
        } catch (error) {
            console.log("MSG_SEEN: ", error);
        }
    });

    socket.on(SOCKET_EVENTS.TYPING, async (data: any) => {
        try {
            if (typeof data === "string") {
                data = JSON.parse(data);
            }

            await refreshPresence(userId);


            const receiverSockets = onlineUsers.get(data.receiverId);

            if (receiverSockets?.size) {
                receiverSockets.forEach((socketId) => {
                    io.to(socketId).emit(SOCKET_EVENTS.USER_TYPING, {
                        senderId: userId
                    });
                });
            }
        } catch (error) {
            console.log("TYP: ", error);
        }
    });

    socket.on(SOCKET_EVENTS.STOP_TYPING, async (data: any) => {
        try {
            if (typeof data === "string") {
                data = JSON.parse(data);
            }

            await refreshPresence(userId);

            const receiverSockets = onlineUsers.get(data.receiverId);

            if (receiverSockets?.size) {
                receiverSockets.forEach((socketId) => {
                    io.to(socketId).emit(SOCKET_EVENTS.STOP_TYPING, {
                        senderId: userId
                    });
                });
            }


        } catch (error) {
            console.log("STOP_TYP: ", error);
        }
    });

    socket.on(SOCKET_EVENTS.DISCONNECT, async () => {
        clearInterval(presenceInterval);

        const userSockets = onlineUsers.get(userId);

        if (userSockets) {
            userSockets.delete(socket.id);
        }

        if (userSockets?.size === 0) {

            await redisClient.del(`user:${userId}`);

            onlineUsers.delete(userId);

            io.emit(SOCKET_EVENTS.ONLINE_USERS, Array.from(onlineUsers.keys()));

            socket.broadcast.emit(SOCKET_EVENTS.USER_OFFLINE, {
                userId
            });
        }

        console.log("User disconnected: ", userId);
    });

}