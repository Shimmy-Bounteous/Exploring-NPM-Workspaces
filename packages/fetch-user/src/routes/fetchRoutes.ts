import { getUser } from '../controllers/fetchController';
import express, { Router } from 'express';

const router = express.Router();

router.get('/get/:_id', getUser);

export default router;
