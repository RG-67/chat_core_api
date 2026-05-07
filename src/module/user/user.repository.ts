import { Pool } from "pg";
import { userLoginType, userRegisterType } from "./user.type";
import { hashPass } from "../../utils/constants";



export class UserRepository {

    constructor(private db: Pool) { }


    async userRegister(userReq: userRegisterType) {
        const password = await hashPass(userReq.password);
        const result = await this.db.query(`INSERT INTO users (name, email, password)
            VALUES ($1, $2, $3) RETURNING id, name, email, created_at as "createdAt"
            `, [userReq.name, userReq.email, password]);
        return result;
    }


    async userLogin(userReq: userLoginType) {
        const user = await this.db.query(`SELECT id, name, email, password FROM users WHERE email=$1`, [userReq.email]);
        return user;
    }


}