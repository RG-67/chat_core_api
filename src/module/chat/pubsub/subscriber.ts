import { Server } from "socket.io";
import redisClient from "../../../config/redis";
import { CHANNELS } from "./channel";
import { SOCKET_EVENTS } from "../socket/socket.events";



export const subscriber = redisClient.duplicate();


export const initSubscriber = async (
    io: Server,
    onlineUsers: Map<string, Set<string>>
) => {

    if (!subscriber.isOpen) {
        await subscriber.connect();
    }

    await subscriber.subscribe(
        CHANNELS.MESSAGE_CREATED,
        async (message) => {
            const data = JSON.parse(message);
            const receiverSockets = onlineUsers.get(data.receiverId);

            if (!receiverSockets?.size) return;

            receiverSockets.forEach((socketId) => {
                io.to(socketId).emit(
                    SOCKET_EVENTS.RECEIVE_MESSAGE,
                    data
                );
            });

        }
    );
    console.log("Subscriber received message.created");
}