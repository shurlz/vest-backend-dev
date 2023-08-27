import { pool } from '../database/postgresql';
import { Request, Response } from 'express';
import { 
    CREATE_POST,
    GET_USER_POSTS
} from '../database/queries';

export const createPost = async (req: Request, res: Response) => {
    const {title, content} = req.body;
    const userId = req.params.id;

    pool.query(CREATE_POST, [userId, title, content], (error: Error, result) => {
        if (error) return res.status(400).json({message: error.message});

        return res.status(201).json({message: result.rows[0]});
    });
};

export const getUserPosts = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    pool.query(GET_USER_POSTS, [id], (error: Error, result) => {
        if (error) return res.status(400).json({message: error.message});

        return res.status(201).json({message: result.rows});
    });
};
