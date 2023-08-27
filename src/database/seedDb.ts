import { pool } from "./postgresql";
import { faker } from "@faker-js/faker";
import { CREATE_COMMENT, CREATE_POST, CREATE_USER } from "./queries";

// create dummy database tables
const numberToCreate = 5;

let createdUsers: number[] = [];
let createdPosts: number[] = [];

const PopulateDB = async () => {
    try {
        for (let i=0; i < numberToCreate; i++) {
            const result = await pool.query(CREATE_USER, [faker.person.firstName(), 'password']);
            createdUsers.push(result.rows[0].id);
        };
        
        for (let i=0; i < numberToCreate; i++) {
            for (let userId of createdUsers) {
                const result = await pool.query(CREATE_POST, [userId, 'title', faker.person.bio()]);
                createdPosts.push(result.rows[0].id);
            };
        };
        
        for (let i=0; i < numberToCreate; i++) {
            for (let postId of createdPosts) {
                await pool.query(CREATE_COMMENT, [postId, faker.person.bio()])
            };
        };
    
        console.log({createdUsers, createdPosts});
    } catch (error) {
        console.log(error);
    };
};

export default PopulateDB;