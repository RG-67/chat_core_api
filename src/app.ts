import fastify from "fastify";
import dbPlugin from '../src/plugins/db';
import { userRoute } from "./module/user/user.route";


export const buildApp = () => {

    const app = fastify({ logger: true });

    app.register(dbPlugin);

    app.register(userRoute, { prefix: 'api/v1/auth' });


    return app;

}