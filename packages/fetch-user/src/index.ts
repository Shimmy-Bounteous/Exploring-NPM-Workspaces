require('dotenv').config();
import express from 'express';
import { connectDB } from '@npm-workspaces/authuser';
import { logRequest } from '@npm-workspaces/authuser';
import fetchRoutes from './routes/fetchRoutes';

const app = express();

// Connect to MongoDB
connectDB();

// Middleware tp parse body to JSON
app.use(express.json());

// Routes
app.use('/', logRequest, fetchRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});