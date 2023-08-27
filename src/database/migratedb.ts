import { pool } from './postgresql';
import {
    CREATE_USERS_DATABASE,
    CREATE_USERNAME_INDEX,
    CREATE_USERS_INDEX,

    CREATE_POSTS_DATABASE,
    CREATE_POSTS_OWNER_INDEX,
    ADD_USERID_FOREIGN_KEY,

    CREATE_COMMENTS_OWNER_INDEX,
    CREATE_COMMENTS_DATABASE,
    ADD_POSTID_FOREIGN_KEY,
} from './queries';
import PopulateDB from './seedDb';

export const migrateDatabase = async () => {
    try {
        // create databases, foreignkeys & indexes
        await pool.query(CREATE_USERS_DATABASE);
        await pool.query(CREATE_USERNAME_INDEX);
        await pool.query(CREATE_USERS_INDEX);

        await pool.query(CREATE_POSTS_DATABASE);
        await pool.query(ADD_USERID_FOREIGN_KEY);
        await pool.query(CREATE_POSTS_OWNER_INDEX);

        await pool.query(CREATE_COMMENTS_DATABASE);
        await pool.query(ADD_POSTID_FOREIGN_KEY);
        await pool.query(CREATE_COMMENTS_OWNER_INDEX);

        // take this part out if it's not necessary
        await PopulateDB();
        
        return true;
    } catch (err) {
        return false;
    };
};

export const dropDatabase =async () => {
    await pool.query("DROP TABLE IF EXISTS comments");
    await pool.query("DROP TABLE IF EXISTS posts");
    await pool.query("DROP TABLE IF EXISTS users"); 
};
