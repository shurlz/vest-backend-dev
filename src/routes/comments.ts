import express, {Router} from 'express';
import { createComment } from '../controllers/comments'; 
import { ValidateBody, ValidateParams } from '../middlewares/validators/validators';
import { commentBody, commentParams } from '../middlewares/validators/comment.validator';

const router: Router = express.Router();

router.post('/:postId/comments', 
            ValidateBody(commentBody), 
            ValidateParams(commentParams), 
            createComment
);

export default router;
