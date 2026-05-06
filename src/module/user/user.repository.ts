import { Pool } from "pg";
import { userRegisterType } from "./user.type";
import { hashPass } from "../../utils/constants";



export class UserRepository {

    constructor(private db: Pool) { }


    async userRegister(userReq: userRegisterType) {
        const password = await hashPass(userReq.password);
        const result = await this.db.query(`INSERT INTO users (name, email, password)
            VALUES ($1, $2, $3) RETURNING name, email, created_at as "createdAt"
            `, [userReq.name, userReq.email, userReq.password]);
        return result;
    }


}