import express, {Router} from 'express';
import { performanceChallenge } from '../controllers/performanceChallenge';

const router: Router = express.Router();

router.get('/', performanceChallenge);

export default router;
