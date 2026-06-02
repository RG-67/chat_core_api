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
                const insertResult: any = await messageService.insertMessage({ senderId, receiverId, content });
                console.log(insertResult.message);

                const createMsgResult = await messageService.createMessageStatus({
                    messageId: insertResult.data.id,
                    userId: receiverId
                });
                console.log(createMsgResult.message);

                break;

            default:
                break;
        }
    }, {
    connection: bullRedis
}
);