import { pool } from '../database/postgresql';
import { Request, Response } from 'express';
import { CREATE_COMMENT } from '../database/queries';

export const createComment = async (req: Request, res: Response) => {
    const {content} = req.body;
    const postId = req.params.postId;

    pool.query(CREATE_COMMENT, [postId, content], (error: Error, result) => {
        if (error) return res.status(400).json({message: error.message});

        return res.status(201).json({message: result.rows[0]});
    });
};
