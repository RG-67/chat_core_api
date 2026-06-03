import { Worker } from "bullmq";
import { pool } from "../../../config/db";
import { MessageRepository } from "../message/message.repository";
import { MessageService } from "../message/message.service";
import { bullRedis } from "../../../config/bullmq";
import { publishMessageCreated } from "../pubsub/publisher";


const messageRepo = new MessageRepository(pool);
const messageService = new MessageService(messageRepo);


export const messageWorker = new Worker(
    "messages",
    async (job) => {
        switch (job.name) {
            case "send-message":
                console.log("Worker processing");
                const { senderId, receiverId, content } = job.data;
                const insertResult: any = await messageService.insertMessage({ senderId, receiverId, content });
                console.log(insertResult.message);

                const createMsgResult = await messageService.createMessageStatus({
                    messageId: insertResult.data.id,
                    userId: receiverId
                });
                console.log(createMsgResult.message);

                await publishMessageCreated({
                    messageId: insertResult.data.id,
                    senderId,
                    receiverId,
                    content
                });

                break;

            default:
                break;
        }
    }, {
    connection: bullRedis
}
);