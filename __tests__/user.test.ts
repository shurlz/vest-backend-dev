import dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
import { faker } from '@faker-js/faker';

import app from '../src/app';
import { pool } from '../src/database/postgresql';
import { CREATE_USER } from '../src/database/queries';


// test create user, unique constraint, endpoint
describe('POST /users', () => {
    it('create new user, test create user endpoint', async () => {
        // test endpoint 
        const reservedName = faker.person.firstName(); 

        const res = await request(app).post('/users').send({
            username: faker.internet.email().toLowerCase(),
            password: faker.person.fullName()
        });
  
        expect(res.statusCode).toBe(201);
        expect(typeof res.body.token).toBe('string');
        expect(typeof res.body.data).toBe('object');

        // test creation query
        pool.query(CREATE_USER, [reservedName, 'password'], (error, result) => {
            expect(error).toBeNull();
            expect(result.rows[0].username).toBe(reservedName);
        });

        // test endpoint with invalid credentials 
        const res2 = await request(app).post('/users').send({
            username: faker.internet.email().toLowerCase()
        });
        expect(res2.statusCode).toBe(400);
    });
});
  

// fetch users logic, bulk fetch / create
describe('POST /users', () => {
    it('create bulk user, fetch users', async () => {
        let apiResponses = [];

        for (let i=0; i < 15; i++) {
            const res = await request(app).post('/users').send({
                username: faker.internet.email().toLowerCase(),
                password: faker.person.fullName()
            });
      
            expect(res.statusCode).toBe(201);
            expect(typeof res.body.token).toBe('string');
            expect(typeof res.body.data).toBe('object');

            apiResponses.push(res.body)
        };

        expect(apiResponses.length).toBe(15);

        let allQueriesResponse = [];

        for (let i=0; i < 15; i++) {
            const reservedName = faker.person.firstName(); 

            const res = await pool.query(CREATE_USER, [reservedName, 'password']);
            allQueriesResponse.push(res.rows[0].id);
            expect(res.rows[0].username).toBe(reservedName);
        };

        expect(allQueriesResponse.length).toBe(15);
        expect(allQueriesResponse[0] + 14).toStrictEqual(allQueriesResponse[14]);

        // fetch all users
        const userToken = apiResponses[0].token;
        const res = await request(app).get('/users')
                        .set("Authorization", `Bearer ${userToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message.lenght).toBeGreaterThan(20);
    });
});
