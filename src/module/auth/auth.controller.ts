import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "./auth.service";




export class AuthController {

    constructor(private service: AuthService) { }

    userRegister = async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const userReq = await this.service.userRegister(req.body as any);
            if (userReq.status) {
                return res.code(201).send(userReq);
            }
            return res.code(400).send(userReq);
        } catch (error: any) {
            return res.code(500).send({ status: false, message: error.message });
        }
    }

    userLogin = async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const result = await this.service.userLogin(req.body as any);
            if (result.status) {
                return res.code(200).send(result);
            }
            return res.code(404).send(result);
        } catch (error: any) {
            return res.code(500).send({ status: false, message: error.message });
        }
    }
    

}