import postgresql, { Pool } from 'pg';

// move credentials to .env file later on
export const pool: Pool = new Pool({
    // user: 'root',
    // host: 'postgres',
    // database: 'vestbank',
    // password: 'password10',
    // port: 5432,
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
});
