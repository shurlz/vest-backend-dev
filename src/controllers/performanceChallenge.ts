import { pool } from '../database/postgresql';
import { Request, Response } from 'express';
import { CHALLENGE_QUERY } from '../database/queries';


export const performanceChallenge = async (req: Request, res: Response) => {

    pool.query(CHALLENGE_QUERY, (error: Error, result) => {
        if (error) return res.status(400).json({message: error.message});

        return res.status(200).json({message: result.rows});
    });
};