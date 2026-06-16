import dotEnv from 'dotenv';
import { buildApp } from './app';
import { getIo, initSocket } from './plugins/socket';
import { connectRedis } from './config/redis';
import { initSubscriber } from './module/chat/pubsub/subscriber';
import { onlineUsers } from './module/chat/presence/presence.service';
import { messageWorker } from './module/chat/queue/message.worker';



dotEnv.config();


const start = async () => {
    const app = buildApp();
    const port = process.env.PORT;
    try {
        await connectRedis();
        initSocket(app.server);
        messageWorker;
        await initSubscriber(getIo(), onlineUsers);
        await app.listen({ port: Number(port) });
        console.log(`Server running at port: ${port}`);
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
}


start();
