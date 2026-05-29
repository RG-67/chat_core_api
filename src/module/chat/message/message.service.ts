import { MessageRepository } from "./message.repository";
import { messageType, sendMessageType } from "./message.types";




export class MessageService {

    constructor(private repo: MessageRepository) { }


    async insertMessage(messageData: messageType): Promise<{ status: Boolean; message: string; data?: object; error?: string }> {
        try {
            const result = await this.repo.insertMessage(messageData);
            if (Number(result.rowCount) > 0) {
                return { status: true, message: "Message inserted", data: result.rows[0] };
            }
            return { status: false, message: "Message not inserted" };
        } catch (error: any) {
            console.error("ERR: ", error.message);
            return { status: false, message: "Internal server error", error: error.message };
        }
    }


    async createMessageStatus(sendMsgType: sendMessageType): Promise<{ status: Boolean; message: string; data?: object; error?: string }> {
        try {
            const result = await this.repo.createMessageStatus(sendMsgType);
            if (Number(result.rowCount) > 0) {
                return { status: true, message: "Message sent", data: result.rows[0] };
            }
            return { status: false, message: "Message sending failed" };
        } catch (error: any) {
            console.error("ERR: ", error.message);
            return { status: false, message: "Internal server error", error: error.message };
        }
    }

    async deliveredMessageStatus(sendMsgType: sendMessageType): Promise<{ status: Boolean; message: string; data?: object; error?: string }> {
        try {
            const result = await this.repo.deliveredMessageStatus(sendMsgType);
            if (Number(result.rowCount) > 0) {
                return { status: true, message: "Message delivered", data: result.rows[0] };
            }
            return { status: false, message: "Message deliver failed" };
        } catch (error: any) {
            console.error("ERR: ", error.message);
            return { status: false, message: "Internal server error", error: error.message };
        }
    }


}