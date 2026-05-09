import fastify from "fastify";
import dbPlugin from '../src/plugins/db';
import { AuthRoute } from "./module/auth/auth.route";


export const buildApp = () => {

    const app = fastify({ logger: true });

    app.register(dbPlugin);

    app.register(AuthRoute, { prefix: 'api/v1/auth' });


    return app;

}