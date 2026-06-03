import redisClient from "../../../config/redis"
import { CHANNELS } from "./channel"



export const publishMessageCreated = async (payload: any) => {
    await redisClient.publish(
        CHANNELS.MESSAGE_CREATED,
        JSON.stringify(payload)
    );
    console.log("Published message.created");
};