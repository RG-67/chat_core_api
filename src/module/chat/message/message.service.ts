import { MessageRepository } from "./message.repository";
import { messageType } from "./message.types";




export class MessageService {

    constructor(private repo: MessageRepository) { }


    async insertMessage(messageData: messageType): Promise<{ status: Boolean; message: string; data?: object; error?: string }> {
        try {
            const result = await this.repo.insertMessage(messageData);
            console.log("RST; ", result.rows);
            if (Number(result.rowCount) > 0) {
                return { status: true, message: "Message inserted", data: result.rows[0] };
            }
            return { status: false, message: "Message not inserted" };
        } catch (error: any) {
            console.error("ERR: ", error.message);
            return { status: false, message: "Internal server error", error: error.message };
        }
    }


}