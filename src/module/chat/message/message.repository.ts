import { Pool } from "pg";
import { messageType } from "./message.types";



export class MessageRepository {

    constructor(private db: Pool) { }


    async insertMessage(messageData: messageType) {
        const result = await this.db.query(`
            INSERT INTO messages (sender_id, receiver_id, content)
            VALUES ($1, $2, $3) RETURNING id, created_at as "createdAt"
            `, [messageData.senderId, messageData.receiverId, messageData.content]);
        return result;
    }

}