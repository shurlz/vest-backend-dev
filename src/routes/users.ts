import express, {Router} from 'express';
import { createPost, getUserPosts } from '../controllers/posts';
import { createUser, getUsers, loginUser } from '../controllers/users'; 

import { ValidateBody, ValidateParams } from '../middlewares/validators/validators';
import { userBody } from '../middlewares/validators/user.validator';
import { postBody, postParams } from '../middlewares/validators/post.validator';

import verifyToken from '../middlewares/auth/token.validator';

const router: Router = express.Router();

// for users
router.post('/', ValidateBody(userBody), createUser);
router.get('/', verifyToken, getUsers);

// sign in user
router.post('/auth', ValidateBody(userBody), loginUser);

// for posts
router.post('/:id/posts', verifyToken, ValidateBody(postBody), ValidateParams(postParams), createPost);
router.get('/:id/posts', verifyToken, ValidateParams(postParams), getUserPosts);

export default router;
