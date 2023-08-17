require('dotenv').config();
import express from 'express';
import connectDB from './config/db';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import logRequest from './middleware/logRequest';
import { OpenAPIV3 } from 'openapi-types';
import YAML from 'yamljs';
import swaggerUI from 'swagger-ui-express';
import * as path from 'path';

const app = express();

// Connect to MongoDB
connectDB();

// Middleware tp parse body to JSON
app.use(express.json());

// To parse the cookies when the refresh endpoint is hit
app.use(cookieParser());

// Load and parse API Specification YAML file
const swaggerSpecs: OpenAPIV3.Document = YAML.load(path.join(__dirname, 'swagger.yaml'));

// Routes
app.use('/', logRequest, authRoutes);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs)); //swaggerUI.serve returns a middleware that provides the UI for the enpoint

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
// .catch((error: NodeJS.ErrnoException) => {
//     if(error.code === 'EADDRINUSE'){
//         console.error(`Port ${PORT} is already in use`);
//     }
//     else{
//         console.error(`Unable to start server on port ${PORT}: Error:`,error);
//     }
// });