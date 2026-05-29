import { Pool } from "pg";
import { messageType, sendMessageType } from "./message.types";



export class MessageRepository {

    constructor(private db: Pool) { }


    async insertMessage(messageData: messageType) {
        const result = await this.db.query(`
            INSERT INTO messages (sender_id, receiver_id, content)
            VALUES ($1, $2, $3) RETURNING id, created_at as "createdAt"
            `, [messageData.senderId, messageData.receiverId, messageData.content]);
        return result;
    }

    async createMessageStatus(sendMsgType: sendMessageType) {
        const result = await this.db.query(`
            INSERT INTO message_status(message_id, user_id)
            VALUES($1, $2) RETURNING id
            `, [sendMsgType.messageId, sendMsgType.userId]);
        return result;
    }

    async deliveredMessageStatus(sendMsgType: sendMessageType) {
        const result = await this.db.query(`
            UPDATE message_status SET delivered_at = now() WHERE message_id = $1 AND user_id = $2
            `, [sendMsgType.messageId, sendMsgType.userId]);
        return result;
    }

}