import { pool } from '../config/db';
import fp from 'fastify-plugin';



export default fp((fastify) => {
    fastify.decorate('db', pool);
});
