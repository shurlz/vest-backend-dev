import express, { Application } from 'express';
import cors from 'cors';
import commentsRouter from './routes/comments';
import usersAndPostsRouter from './routes/users';
import challengeRouter from './routes/performanceChallenge';

const app: Application = express();

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/users', usersAndPostsRouter);
app.use('/posts', commentsRouter);
app.use('/performance-challenge', challengeRouter);

export default app;