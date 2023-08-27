import bcrypt from 'bcryptjs';
import { pool } from '../database/postgresql';
import { Request, Response } from 'express';
import createToken from '../middlewares/auth/createToken';
import { 
    CREATE_USER,
    GET_USER,
    GET_USERS,
} from '../database/queries';

type UserResponse = {
    id: number,
    username: string,
    created_at: Date,
};

export const createUser = async (req: Request, res: Response) => {
    const {username, password} = req.body;
    const hashedPwd = await bcrypt.hash(password, 5);

    pool.query(CREATE_USER, [username, hashedPwd], (error: Error, result) => {
        if (error) return res.status(400).json({message: error.message});

        const data: UserResponse = {
            id: result.rows[0].id, username: result.rows[0].username, created_at: result.rows[0].createdat
        };
        
        const token = createToken(data.id);
        return res.status(201).json({data, token});
    });
};


export const getUsers = async (req: Request, res: Response) => {
    pool.query(GET_USERS, (error: Error, result) => {
        if (error) return res.status(400).json({message: error.message});

        return res.status(201).json({message: result.rows});
    });
};


export const loginUser = async (req: Request, res: Response) => {
    const {username, password} = req.body;

    pool.query(GET_USER, [username], (error: Error, result) => {
        if (error) return res.status(400).json({message: "Invalid login credentials"});
        
        // check if password is valid here
        const hashedPwd = result.rows[0].password;
        if (!bcrypt.compareSync(password, hashedPwd)) {
            return res.status(400).json({message: "Invalid login credentials"});
        };

        const data: UserResponse = {
            id: result.rows[0].id, username: result.rows[0].username, created_at: result.rows[0].createdAt
        };
        const token = createToken(data.id);

        return res.status(201).json({ token, data });
    });
};
