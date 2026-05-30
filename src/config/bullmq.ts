import IORedis from 'ioredis';
import dotEnv from 'dotenv';

dotEnv.config();

export const bullRedis = new IORedis({
    host: process.env.DB_HOST,
    port: Number(process.env.REDIS_PORT),
    maxRetriesPerRequest: null
})