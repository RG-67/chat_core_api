import dotEnv from 'dotenv';
import { buildApp } from './app';



dotEnv.config();


const start = async () => {
    const app = buildApp();
    const port = process.env.PORT;
    try {
        await app.listen({ port: Number(port) });
        console.log(`Server running at port: ${port}`);
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
}


start();