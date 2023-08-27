// @ts-nocheck
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader: string = req.headers.authorization;
  if (!authHeader) return res.status(401).json({message: 'please provide a token'});

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({message: 'invalid token'});
    (req.id = decoded.id),
    next();
  });
};

export default verifyToken;
