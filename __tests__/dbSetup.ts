import dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';

export const pool: Pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
});