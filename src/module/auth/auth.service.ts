import { compareHass } from "../../utils/constants";
import { AuthRepository } from "./auth.repository";
import { userLoginType, userRegisterType } from "./auth.type";
import jwt from 'jsonwebtoken';
import dotEnv from 'dotenv';

dotEnv.config();

export class AuthService {

    constructor(private repo: AuthRepository) { }

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


    async userLogin(userReq: userLoginType): Promise<{ status: boolean; message: string; data?: object; error?: string }> {
        try {
            const result = await this.repo.userLogin(userReq);
            if (Number(result.rowCount) > 0) {
                const isMatch = await compareHass(userReq.password, result.rows[0].password);
                if (isMatch) {
                    const userData = {
                        id: result.rows[0].id,
                        name: result.rows[0].name,
                        email: result.rows[0].email
                    }
                    const token = jwt.sign({
                        data: userData
                    }, process.env.JWT_SECRET as string, { expiresIn: '15m' });
                    return { status: true, message: "User retrieved successfully", data: { ...userData, token } };
                }
                return { status: false, message: "Incorrect password" };
            }
            return { status: false, message: "User not found" };
        } catch (error: any) {
            return { status: false, message: error.message };
        }
    }


}