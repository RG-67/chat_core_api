import dotEnv from 'dotenv';
import { createClient } from 'redis';

dotEnv.config();


const redisClient = createClient({
    url: `redis://localhost:${process.env.REDIS_PORT}`
});

redisClient.on("error", (err) => {
    console.log("Redis Error", err);
});


export async function connectRedis() {
    await redisClient.connect();
    console.log("Redis connected");
}



export default redisClient;