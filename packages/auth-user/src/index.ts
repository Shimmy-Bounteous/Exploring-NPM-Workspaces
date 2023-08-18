require('dotenv').config();
import Users from "./models/user";
import User from "./types/userType";
import express from 'express';
import connectDB from './config/db';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import logRequest from './middleware/logRequest';

const app = express();

// Middleware tp parse body to JSON
app.use(express.json());

// To parse the cookies when the refresh endpoint is hit
app.use(cookieParser());

// Routes
app.use('/', logRequest, authRoutes);

export { connectDB, logRequest, Users as UsersDB, User };
