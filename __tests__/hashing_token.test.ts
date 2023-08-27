import dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
import { faker } from '@faker-js/faker';

import app from '../src/app';
import bcrypt from 'bcryptjs';
import { pool } from '../src/database/postgresql';
import { GET_USER } from '../src/database/queries';


// test create token, login user
describe('POST /users', () => {
    it('create new user, test password hash, test user login, test token', async () => {
        const name = faker.person.firstName(); 
        const password = 'password';
        
        const res = await request(app).post('/users').send({
            username: name,
            password: password
        });

        const response = await pool.query(GET_USER, [name]);
        expect(response.rows.length).toBeGreaterThan(0);
        expect(res.body.data.username).toBe(response.rows[0].username);

        expect(bcrypt.compareSync(password, response.rows[0].password)).toBeTruthy();

        // login user
        const resLogin = await request(app).post('/users/auth').send({
            username: name,
            password: password
        });
        expect(resLogin.statusCode).toBe(200);
    });
});
