import { FastifyInstance } from "fastify";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { userRegisterSchema } from "./user.schema";



export function userRoute(app: any) {

    const repo = new UserRepository(app.db);
    const service = new UserService(repo);
    const controller = new UserController(service);

    app.post('/user_register', { schema: userRegisterSchema }, controller.userRegister);

}