import { Queue } from 'bullmq';
import { bullRedis as redisClient } from '../../../config/bullmq';



export const queue = new Queue("messages", {
    connection: redisClient
});