import { Worker } from "bullmq";
import { pool } from "../../../config/db";
import { MessageRepository } from "../message/message.repository";
import { MessageService } from "../message/message.service";
import { bullRedis } from "../../../config/bullmq";


const messageRepo = new MessageRepository(pool);
const messageService = new MessageService(messageRepo);


export const messageWorker = new Worker(
    "messages",
    async (job) => {
        switch (job.name) {
            case "send-message":
                const { senderId, receiverId, content } = job.data;
                const result: any = await messageService.insertMessage({ senderId, receiverId, content });

                await messageService.createMessageStatus({
                    messageId: result.data.id,
                    userId: receiverId
                })
                break;

            default:
                break;
        }
    }, {
    connection: bullRedis
}
);