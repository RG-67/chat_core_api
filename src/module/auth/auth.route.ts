import { FastifyInstance } from "fastify";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { userLoginSchema, userRegisterSchema } from "./auth.schema";



export function AuthRoute(app: any) {

    const repo = new AuthRepository(app.db);
    const service = new AuthService(repo);
    const controller = new AuthController(service);

    app.post('/user_register', { schema: userRegisterSchema }, controller.userRegister).post('/user_login', { schema: userLoginSchema }, controller.userLogin);

}