import express, { Router } from 'express';
const router = express.Router();

import {
    signup,
    login,
    refresh
} from '../controllers/authController';

// Middleware to validate password
import validatePassword from '../middleware/passwordValidator';
import dateParser from '../middleware/dateParser';
import validateEmail from '../middleware/emailValidator';

router.post('/signup', dateParser, validateEmail, validatePassword, signup);
router.post('/login', validateEmail, login);
router.post('/refresh', refresh);

export default router;