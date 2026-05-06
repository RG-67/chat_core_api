import { UserRepository } from "./user.repository";
import { userRegisterType } from "./user.type";




export class UserService {

    constructor(private repo: UserRepository) { }

    async userRegister(userReq: userRegisterType): Promise<{ status: boolean; message: string; data?: string; error?: string }> {
        try {
            const result = await this.repo.userRegister(userReq);
            if (Number(result.rowCount) > 0) {
                return { status: true, message: "User registered successfully", data: result.rows[0] };
            }
            return { status: false, message: "User registration failed" };
        } catch (error: any) {
            return { status: false, message: error.message };
        }
    }


}